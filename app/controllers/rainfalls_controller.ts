import type { HttpContext } from '@adonisjs/core/http'
import fs from 'node:fs/promises'
import path from 'node:path'
import app from '@adonisjs/core/services/app'
import axios from 'axios'
import { DateTime } from 'luxon'

export default class RainfallsController {
    private dbPath = app.makePath('json-db')
    private locationsFile = path.join(this.dbPath, 'locations.json')
    private rainfallFile = path.join(this.dbPath, 'rainfall.json')


    public async getLocations({ response }: HttpContext) {
        try {
            const data = await fs.readFile(this.locationsFile, 'utf-8')
            const locations = JSON.parse(data)
            return response.json(locations)
        } catch (error) {
            return response.json([])
        }
    }

    public async addLocation({ request, response }: HttpContext) {
        const { name, lat, lon } = request.only(['name', 'lat', 'lon'])

        if (!name || !lat || !lon) {
            return response.badRequest({ message: 'Missing required fields' })
        }

        try {
            let locations = []
            try {
                const data = await fs.readFile(this.locationsFile, 'utf-8')
                locations = JSON.parse(data)
            } catch (e) {
            }

            const exists = locations.find((l: any) => l.name.toLowerCase() === name.toLowerCase())
            if (exists) {
                exists.lat = lat
                exists.lon = lon
            } else {
                locations.push({ name, lat, lon })
            }

            await fs.writeFile(this.locationsFile, JSON.stringify(locations, null, 2))
            return response.json({ message: 'Location saved', locations })
        } catch (error) {
            return response.internalServerError({ message: 'Failed to save location' })
        }
    }

    public async fetchAndSave({ response }: HttpContext) {
        try {
            const locData = await fs.readFile(this.locationsFile, 'utf-8')
            const locations = JSON.parse(locData)

            if (!locations.length) {
                return response.badRequest({ message: 'No locations found' })
            }

            const endDate = DateTime.now().toFormat('yyyy-MM-dd')
            const startDate = DateTime.now().minus({ days: 35 }).toFormat('yyyy-MM-dd')

            const results = []

            for (const loc of locations) {
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&daily=precipitation_sum&timezone=Asia%2FSingapore&start_date=${startDate}&end_date=${endDate}`

                const apiRes = await axios.get(url)

                const daily = apiRes.data.daily
                const dates = daily.time
                const precip = daily.precipitation_sum

                const lastIndex = dates.length - 1
                const targetDate = dates[lastIndex]

                const oneDaySum = precip[lastIndex] || 0

                let threeDaySum = 0
                let threeDayRange = ''
                const start3 = Math.max(0, lastIndex - 2)
                for (let i = start3; i <= lastIndex; i++) {
                    threeDaySum += precip[i] || 0
                }
                if (dates[start3]) {
                    threeDayRange = `${this.formatDate(dates[start3])} – ${this.formatDate(targetDate)}`
                }

                let thirtyDaySum = 0
                let thirtyDayRange = ''
                const start30 = Math.max(0, lastIndex - 29)
                for (let i = start30; i <= lastIndex; i++) {
                    thirtyDaySum += precip[i] || 0
                }
                if (dates[start30]) {
                    thirtyDayRange = `${this.formatDate(dates[start30])} – ${this.formatDate(targetDate)}`
                }

                results.push({
                    Location: loc.name,
                    Date: targetDate,
                    "1-day": `${oneDaySum.toFixed(1)} mm (${this.formatDate(targetDate)})`,
                    "3-day": `${threeDaySum.toFixed(1)} mm (${threeDayRange})`,
                    "30-day": `${thirtyDaySum.toFixed(1)} mm (${thirtyDayRange})`,
                    timestamp: DateTime.now().toISO(),
                    raw: {
                        oneDay: oneDaySum,
                        threeDay: threeDaySum,
                        thirtyDay: thirtyDaySum
                    }
                })
            }

            let dbData = []
            try {
                const existing = await fs.readFile(this.rainfallFile, 'utf-8')
                dbData = JSON.parse(existing)
            } catch (e) {
                dbData = []
            }

            for (const res of results) {
                const index = dbData.findIndex((d: any) => d.Location === res.Location && d.Date === res.Date)
                if (index >= 0) {
                    dbData[index] = res
                } else {
                    dbData.push(res)
                }
            }

            dbData.sort((a: any, b: any) => {
                if (a.Date !== b.Date) return b.Date.localeCompare(a.Date)
                return a.Location.localeCompare(b.Location)
            })

            await fs.writeFile(this.rainfallFile, JSON.stringify(dbData, null, 2))

            return response.json({ message: 'Data fetched and saved', data: dbData })

        } catch (error) {
            console.error(error)
            return response.internalServerError({ message: 'Failed to fetch/save data', error: error.message })
        }
    }

    public async getRainfall({ response }: HttpContext) {
        try {
            const data = await fs.readFile(this.rainfallFile, 'utf-8')
            return response.json(JSON.parse(data))
        } catch (e) {
            return response.json([])
        }
    }

    public async clearData({ response }: HttpContext) {
        try {
            await fs.writeFile(this.rainfallFile, JSON.stringify([], null, 2))
            return response.json({ message: 'Data cleared' })
        } catch (error) {
            return response.internalServerError({ message: 'Failed to clear data' })
        }
    }

    private formatDate(dateStr: string) {
        return DateTime.fromISO(dateStr).toFormat('d/M/yyyy')
    }
}