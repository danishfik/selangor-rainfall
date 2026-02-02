<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Head } from '@inertiajs/vue3'
import apiService from '../utils/api'
import useSwal from '../utils/useSwal'

const { handleSuccess, handleError, handleLoading } = useSwal()

const output = ref<any[]>([])
const locations = ref<any[]>([])
const loading = ref(false)
const newLoc = ref({ name: '', lat: '', lon: '' })
const showAddLoc = ref(false)

const fetchLocations = async () => {
  try {
    const res = await apiService.apiCall<any[]>('GET', '/api/locations')
    locations.value = res.data
  } catch (e: any) {
    console.error('Failed to load locations', e)
  }
}

const loadStoredData = async () => {
    try {
        const res = await apiService.apiCall<any[]>('GET', '/api/rainfall')
        if (res.data && res.data.length > 0) {
            output.value = res.data
        }
    } catch (e) {
        console.error('Failed to load stored data', e)
    }
}

const saveLocation = async () => {
    if(!newLoc.value.name || !newLoc.value.lat || !newLoc.value.lon) {
         handleError('Error', 'Please fill all fields')
         return
    }
    
    loading.value = true
    handleLoading('Saving', 'Saving location...')
    try {
        await apiService.apiCall('POST', '/api/locations', {
            name: newLoc.value.name,
            lat: parseFloat(newLoc.value.lat),
            lon: parseFloat(newLoc.value.lon)
        })
        await fetchLocations()
        handleSuccess('Saved', 'Location added successfully')
        newLoc.value = { name: '', lat: '', lon: '' }
        showAddLoc.value = false
    } catch (e: any) {
        handleError('Error', 'Failed to save location')
    } finally {
        loading.value = false
    }
}

const fetchData = async () => {
  loading.value = true
  handleLoading('Processing', 'Fetching rainfall data and saving to DB...')
  
  try {
      const res = await apiService.apiCall<any>('POST', '/api/rainfall/fetch')
      output.value = res.data.data 
      
      handleSuccess('Success', 'Rainfall data fetched and saved to database.')
  } catch (error: any) {
    console.error(error)
    handleError('Error', 'Failed to fetch rainfall data. ' + (error.message || ''))
  } finally {
    loading.value = false
  }
}

const clearData = async () => {
    loading.value = true
    handleLoading('Clearing', 'Clearing data...')
    try {
        await apiService.apiCall('POST', '/api/rainfall/clear')
        output.value = []
        handleSuccess('Cleared', 'All rainfall data cleared.')
    } catch (e: any) {
        handleError('Error', 'Failed to clear data')
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchLocations()
    loadStoredData()
})

</script>

<template>
  <Head title="Rainfall System" />
  
  <div class="min-h-screen bg-[#27282C] text-white p-8 font-sans">
    <div class="max-w-4xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-700 pb-4 gap-4">
        <h1 class="text-3xl font-bold text-gray-100">Daily Rainfall System (Selangor)</h1>
        
        <div class="flex flex-wrap gap-2 justify-center md:justify-end">
            <button 
                @click="showAddLoc = !showAddLoc"
                class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
            >
                {{ showAddLoc ? 'Cancel' : '+ Location' }}
            </button>
             <button 
                @click="clearData"
                class="bg-red-900/50 hover:bg-red-800 text-red-100 px-4 py-2 rounded-lg font-semibold transition text-sm border border-red-800"
                v-if="output.length > 0"
            >
                Clear Data
            </button>
            <button 
                @click="fetchData" 
                :disabled="loading"
                class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50 text-sm"
            >
                {{ loading ? 'Processing...' : 'Fetch & Save' }}
            </button>
        </div>
      </div>

      <div v-if="showAddLoc" class="mb-8 p-6 bg-[#333] rounded-lg border border-gray-600 animate-in fade-in slide-in-from-top-4">
          <h3 class="text-lg font-bold mb-4">Add New Location</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input v-model="newLoc.name" placeholder="Location Name" class="bg-[#222] p-2 rounded border border-gray-500 text-white focus:border-blue-500 outline-none transition" />
              <input v-model="newLoc.lat" type="number" step="any" placeholder="Latitude" class="bg-[#222] p-2 rounded border border-gray-500 text-white focus:border-blue-500 outline-none transition" />
              <input v-model="newLoc.lon" type="number" step="any" placeholder="Longitude" class="bg-[#222] p-2 rounded border border-gray-500 text-white focus:border-blue-500 outline-none transition" />
          </div>
          <div class="flex justify-end">
              <button @click="saveLocation" class="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-bold transition">Save Location</button>
          </div>
      </div>

      <div class="mb-6 bg-[#2a2a2a] p-3 rounded border border-gray-700">
          <p class="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">Monitored Locations</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="loc in locations" :key="loc.name" class="bg-blue-900/30 text-blue-200 px-2 py-1 rounded text-sm border border-blue-900/50">
                {{ loc.name }}
            </span>
          </div>
      </div>

      <div v-if="output.length > 0" class="space-y-6">
        <div class="bg-[#1e1e1e] rounded-xl p-6 shadow-xl border border-gray-800 relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition">
                <span class="text-xs text-gray-500">Live DB View</span>
            </div>
           <h2 class="text-xl font-semibold mb-4 text-green-400">Database Records</h2>
           <pre class="bg-black p-4 rounded-lg overflow-x-auto text-green-300 font-mono text-sm leading-relaxed max-h-96 md:max-h-[500px] scrollbar-thin scrollbar-thumb-gray-700">{{ JSON.stringify(output, null, 2) }}</pre>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="(item, idx) in output" :key="idx" class="bg-[#333] p-4 rounded-lg border border-gray-700 hover:border-gray-500 transition">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h3 class="font-bold text-lg text-blue-300">{{ item.Location }}</h3>
                        <p class="text-gray-400 text-sm">{{ item.Date }}</p>
                    </div>
                </div>
                
                <div class="space-y-2 mt-3 pt-3 border-t border-gray-600/50">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-400 text-sm">1-Day Rainfall</span>
                        <span class="font-medium bg-gray-700/50 px-2 py-0.5 rounded text-white">{{ item["1-day"] }}</span>
                    </div>
                     <div class="flex justify-between items-center">
                        <span class="text-gray-400 text-sm">3-Day Rainfall</span>
                        <span class="font-medium bg-gray-700/50 px-2 py-0.5 rounded text-white">{{ item["3-day"] }}</span>
                    </div>
                     <div class="flex justify-between items-center">
                        <span class="text-gray-400 text-sm">30-Day Rainfall</span>
                        <span class="font-medium bg-gray-700/50 px-2 py-0.5 rounded text-white">{{ item["30-day"] }}</span>
                    </div>
                </div>
            </div>
        </div>

      </div>

      <div v-else class="text-center py-20 text-gray-500 bg-[#222] rounded-xl border border-dashed border-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p class="text-lg font-semibold">No Data Available</p>
        <p class="text-sm mt-2 max-w-md mx-auto">Click "Fetch & Save" to retrieve the latest rainfall data from the API and save it to your local database.</p>
      </div>
    </div>
  </div>
</template>