import Swal, { SweetAlertResult } from "sweetalert2";

interface MobileStyles {
    width: string;
    padding: string;
    fontSize: string;
}

interface UseSwalReturn {
    handleSuccess: (successTitle: string, successText: string) => Promise<SweetAlertResult<any>>;
    handleError: (errorTitle: string, errorText: string) => Promise<SweetAlertResult<any>>;
    handleConfirmation: (confirmationTitle: string, confirmationText: string) => Promise<SweetAlertResult<any>>;
    handleLoading: (loadingTitle: string, loadingText: string) => void;
    handleInputRequestNumber: (
        requestTitle: string,
        requestLabel: string,
        requestValue: string | number | null,
        requestPlaceHolder: string,
        requestValidator: string,
        min: number | null,
        max: number | null,
        decimalAllow: boolean,
        decimalPlaces: number | null
    ) => Promise<SweetAlertResult<string>>;
    handleInputRequestDate: (
        requestTitle: string,
        requestLabel: string,
        requestValue: string | number | null,
        requestPlaceHolder: string,
        requestValidator: string,
        minDate: string | number | Date | null,
        maxDate: string | number | Date | null
    ) => Promise<SweetAlertResult<string>>;
}

const getMobileStyles = (): MobileStyles => ({
    width: 'min(90vw, 400px)',
    padding: '1rem',
    fontSize: '0.9rem',
});

const applyMobileStyles = (
    popup: HTMLElement | null,
    confirmButton: HTMLElement | null,
    cancelButton: HTMLElement | null = null
): void => {
    if (popup) {
        popup.style.zIndex = "9999";
        popup.style.width = 'min(90vw, 400px)';
        popup.style.maxWidth = '90vw';
        popup.style.margin = '1rem';
        popup.style.borderRadius = '12px';

        const title = popup.querySelector('.swal2-title') as HTMLElement | null;
        if (title) {
            title.style.fontSize = 'clamp(1.1rem, 4vw, 1.5rem)';
            title.style.lineHeight = '1.3';
            title.style.marginBottom = '1rem';
        }

        const content = popup.querySelector('.swal2-html-container') as HTMLElement | null;
        if (content) {
            content.style.fontSize = 'clamp(0.9rem, 3.5vw, 1rem)';
            content.style.lineHeight = '1.4';
            content.style.padding = '0 0.5rem';
        }

        const actions = popup.querySelector('.swal2-actions') as HTMLElement | null;
        if (actions) {
            actions.style.flexDirection = window.innerWidth < 480 ? 'column' : 'row';
            actions.style.gap = '0.75rem';
            actions.style.margin = '1.5rem 0 0 0';
            actions.style.padding = '0 0.5rem';
        }
    }

    if (confirmButton) {
        confirmButton.style.color = '#000000';
        confirmButton.style.minHeight = '44px'; 
        confirmButton.style.minWidth = '100px';
        confirmButton.style.fontSize = 'clamp(0.9rem, 3.5vw, 1rem)';
        confirmButton.style.fontWeight = '600';
        confirmButton.style.borderRadius = '8px';
        confirmButton.style.padding = '0.75rem 1.5rem';

        if (window.innerWidth < 480) {
            confirmButton.style.width = '100%';
        }
    }

    if (cancelButton) {
        cancelButton.style.color = '#FFFFFF';
        cancelButton.style.minHeight = '44px';
        cancelButton.style.minWidth = '100px';
        cancelButton.style.fontSize = 'clamp(0.9rem, 3.5vw, 1rem)';
        cancelButton.style.fontWeight = '600';
        cancelButton.style.borderRadius = '8px';
        cancelButton.style.padding = '0.75rem 1.5rem';

        if (window.innerWidth < 480) {
            cancelButton.style.width = '100%';
        }
    }
};

function handleSuccess(successTitle: string, successText: string): Promise<SweetAlertResult<any>> {

    return Swal.fire({
        title: successTitle,
        text: successText,
        icon: "success",
        background: '#27282C',
        color: '#FFFFFF',
        allowOutsideClick: true,
        allowEscapeKey: false,
        confirmButtonColor: "#FFFFFF",
        width: getMobileStyles().width,
        padding: getMobileStyles().padding,
        didOpen: () => {
            Swal.hideLoading();
            const popup = Swal.getPopup();
            const confirmButton = Swal.getConfirmButton();
            applyMobileStyles(popup, confirmButton);
        }
    });
}

function handleError(errorTitle: string, errorText: string): Promise<SweetAlertResult<any>> {

    return Swal.fire({
        title: errorTitle,
        text: errorText,
        icon: "error",
        background: '#212121',
        color: '#FFFFFF',
        allowOutsideClick: true,
        allowEscapeKey: false,
        confirmButtonColor: "#FFFFFF",
        width: getMobileStyles().width,
        padding: getMobileStyles().padding,
        didOpen: () => {
            Swal.hideLoading();
            const popup = Swal.getPopup();
            const confirmButton = Swal.getConfirmButton();
            applyMobileStyles(popup, confirmButton);
        }
    });
}

function handleConfirmation(confirmationTitle: string, confirmationText: string): Promise<SweetAlertResult<any>> {

    return Swal.fire({
        title: confirmationTitle,
        text: confirmationText,
        icon: "warning",
        showCancelButton: true,
        background: '#212121',
        color: '#FFFFFF',
        allowOutsideClick: true,
        allowEscapeKey: false,
        confirmButtonColor: "#FFFFFF",
        cancelButtonColor: "#424242",
        width: getMobileStyles().width,
        padding: getMobileStyles().padding,
        didOpen: () => {
            const popup = Swal.getPopup();
            const confirmButton = Swal.getConfirmButton();
            const cancelButton = Swal.getCancelButton();
            applyMobileStyles(popup, confirmButton, cancelButton);
        }
    });
}

function handleLoading(loadingTitle: string, loadingText: string): void {

    Swal.fire({
        title: loadingTitle,
        text: loadingText,
        icon: "warning",
        background: '#212121',
        color: '#FFFFFF',
        allowOutsideClick: false,
        allowEscapeKey: false,
        width: getMobileStyles().width,
        padding: getMobileStyles().padding,
        didOpen: () => {
            const popup = Swal.getPopup();
            if (popup) {
                popup.style.zIndex = "9999";
                popup.style.width = 'min(90vw, 400px)';
                popup.style.maxWidth = '90vw';
                popup.style.margin = '1rem';

                const title = popup.querySelector('.swal2-title') as HTMLElement | null;
                if (title) {
                    title.style.fontSize = 'clamp(1.1rem, 4vw, 1.5rem)';
                }

                const content = popup.querySelector('.swal2-html-container') as HTMLElement | null;
                if (content) {
                    content.style.fontSize = 'clamp(0.9rem, 3.5vw, 1rem)';
                }
            }

            Swal.showLoading();
            const loader = document.querySelector('.swal2-loader') as HTMLElement | null;
            if (loader) {
                loader.style.borderColor = `#FFFFFF rgba(0, 0, 0, 0) #FFFFFF rgba(0, 0, 0, 0)`;
                loader.style.width = 'clamp(35px, 8vw, 50px)';
                loader.style.height = 'clamp(35px, 8vw, 50px)';
            }
        }
    });
}

function handleInputRequestNumber(
    requestTitle: string,
    requestLabel: string,
    requestValue: string | number | null,
    requestPlaceHolder: string,
    requestValidator: string,
    min: number | null,
    max: number | null,
    decimalAllow: boolean,
    decimalPlaces: number | null
): Promise<SweetAlertResult<string>> {

    console.log('max', max);

    const processedValue = (requestValue === null || requestValue === "") ? null : requestValue;

    return Swal.fire({
        icon: "warning",
        title: requestTitle,
        input: "text",
        background: '#212121',
        color: '#FFFFFF',
        confirmButtonColor: "#FFFFFF",
        cancelButtonColor: "#666666",
        inputLabel: requestLabel,
        inputValue: processedValue?.toString() || '',
        inputPlaceholder: requestPlaceHolder,
        showCancelButton: true,
        allowOutsideClick: true,
        allowEscapeKey: false,
        width: getMobileStyles().width,
        padding: getMobileStyles().padding,
        didOpen: () => {
            const popup = Swal.getPopup();
            const confirmButton = Swal.getConfirmButton();
            const cancelButton = Swal.getCancelButton();

            applyMobileStyles(popup, confirmButton, cancelButton);

            const input = Swal.getInput() as HTMLInputElement | null;
            if (input) {
                input.style.backgroundColor = '#333333';
                input.style.color = '#FFFFFF';
                input.style.borderColor = '#FFFFFF';
                input.style.borderRadius = '6px';
                input.style.padding = '0.75rem';
                input.style.fontSize = 'clamp(1rem, 4vw, 1.1rem)';
                input.style.minHeight = '44px'; 
                input.style.width = '100%';
                input.style.boxSizing = 'border-box';

                input.setAttribute('inputmode', decimalAllow ? 'decimal' : 'numeric');
                if (window.innerWidth < 768) {
                    input.setAttribute('pattern', decimalAllow ? '[0-9]*\\.?[0-9]*' : '[0-9]*');
                }

                const inputLabel = popup?.querySelector('.swal2-input-label') as HTMLElement | null;
                if (inputLabel) {
                    inputLabel.style.fontSize = 'clamp(0.9rem, 3.5vw, 1rem)';
                    inputLabel.style.marginBottom = '0.75rem';
                }

                input.addEventListener('keypress', (event: KeyboardEvent) => {
                    const char = event.key;
                    const currentValue = input.value;

                    const isNumeric = /[0-9]/.test(char);
                    const isDecimalPoint = decimalAllow && char === '.' && !currentValue.includes('.');
                    const isNegativeSign = char === '-' && currentValue === '';

                    if (decimalAllow && decimalPlaces !== null && decimalPlaces !== undefined) {
                        const parts = currentValue.split('.');
                        if (parts.length > 1 && parts[1].length >= decimalPlaces &&
                            input.selectionStart !== null && input.selectionStart > parts[0].length) {
                            if (isNumeric) {
                                event.preventDefault();
                                return;
                            }
                        }
                    }

                    if (!isNumeric && !isDecimalPoint && !isNegativeSign) {
                        event.preventDefault();
                    }
                });
            }
        },
        inputValidator: (value: string): string | null => {
            if (!value) {
                return requestValidator;
            }

            const numValue = decimalAllow
                ? parseFloat(value)
                : parseInt(value, 10);

            if (isNaN(numValue)) {
                return "Please enter a valid number";
            }

            const hasNonZeroDigit = /[1-9]/.test(value.replace(/[.-]/g, ''));

            if (!hasNonZeroDigit) {
                return "Please enter a value with a meaningful non-zero digit";
            }

            const wholeNumber = value.split('.');

            const isValidNumber = /^-?([1-9]\d*|0)$/.test(wholeNumber[0]);

            if (!isValidNumber) {
                return "Please enter a valid whole number without leading zeros";
            }

            if (min !== null && min !== undefined && numValue < min) {
                return `Value must be at least ${min}`;
            }

            if (max !== null && max !== undefined && numValue > max) {
                return `Value must be at most ${max}`;
            }

            if (decimalAllow && decimalPlaces !== null && decimalPlaces !== undefined) {
                const parts = value.split('.');
                if (parts.length > 1 && parts[1].length > decimalPlaces) {
                    return `Please enter a number with maximum ${decimalPlaces} decimal place${decimalPlaces !== 1 ? 's' : ''}`;
                }
            }

            return null;
        }
    });
}

function handleInputRequestDate(
    requestTitle: string,
    requestLabel: string,
    requestValue: string | number | null,
    requestPlaceHolder: string,
    requestValidator: string,
    minDate: string | number | Date | null,
    maxDate: string | number | Date | null
): Promise<SweetAlertResult<string>> {


    let processedValue = requestValue;
    if (processedValue && /^\d+$/.test(processedValue.toString())) {
        processedValue = new Date(parseInt(processedValue.toString())).toISOString().split('T')[0];
    }

    function addOneDay(date: string | number | Date | null): Date | null {
        const preparedDate = prepareDate(date);

        if (!preparedDate) return null;

        const newDate = new Date(preparedDate);
        newDate.setDate(preparedDate.getDate() + 1);

        return newDate;
    }

    const prepareDate = (date: string | number | Date | null): Date | null => {
        if (typeof date === 'string' && /^\d+$/.test(date)) {
            date = parseInt(date);
        }

        if (typeof date === 'number') return new Date(date);
        if (date instanceof Date) return date;
        return date ? new Date(date) : null;
    };

    const preparedMinDate = prepareDate(addOneDay(minDate));
    const preparedMaxDate = prepareDate(addOneDay(maxDate));

    if (!processedValue && preparedMinDate) {
        processedValue = preparedMinDate.toISOString().split('T')[0];
    }

    return Swal.fire({
        icon: "warning",
        title: requestTitle,
        input: "date",
        background: '#212121',
        color: '#FFFFFF',
        confirmButtonColor: "#FFFFFF",
        cancelButtonColor: "#666666",
        inputLabel: requestLabel,
        inputValue: processedValue?.toString() || '',
        inputPlaceholder: requestPlaceHolder,
        showCancelButton: true,
        allowOutsideClick: true,
        allowEscapeKey: false,
        width: getMobileStyles().width,
        padding: getMobileStyles().padding,
        didOpen: () => {
            const popup = Swal.getPopup();
            const confirmButton = Swal.getConfirmButton();
            const cancelButton = Swal.getCancelButton();

            applyMobileStyles(popup, confirmButton, cancelButton);

            const input = Swal.getInput() as HTMLInputElement | null;
            if (input) {
                input.style.backgroundColor = '#333333';
                input.style.color = '#FFFFFF';
                input.style.borderColor = '#FFFFFF';
                input.style.borderRadius = '6px';
                input.style.padding = '0.75rem';
                input.style.fontSize = 'clamp(1rem, 4vw, 1.1rem)';
                input.style.minHeight = '44px'; 
                input.style.width = '100%';
                input.style.boxSizing = 'border-box';

                const inputLabel = popup?.querySelector('.swal2-input-label') as HTMLElement | null;
                if (inputLabel) {
                    inputLabel.style.fontSize = 'clamp(0.9rem, 3.5vw, 1rem)';
                    inputLabel.style.marginBottom = '0.75rem';
                }

                if (preparedMinDate) {
                    input.min = preparedMinDate.toISOString().split('T')[0];
                }

                if (preparedMaxDate) {
                    input.max = preparedMaxDate.toISOString().split('T')[0];
                }

                input.addEventListener('change', function () {
                    const selectedDate = new Date(this.value);

                    if (preparedMinDate && selectedDate < preparedMinDate) {
                        this.value = preparedMinDate.toISOString().split('T')[0];
                    }

                    if (preparedMaxDate && selectedDate > preparedMaxDate) {
                        this.value = preparedMaxDate.toISOString().split('T')[0];
                    }
                });
            }
        },
        inputValidator: (value: string): string | null => {
            if (!value) {
                return requestValidator || "Please enter a date";
            }

            const selectedDate = new Date(value);

            if (preparedMinDate) {
                if (selectedDate < preparedMinDate) {
                    return `Date must be on or after ${preparedMinDate.toLocaleDateString()}`;
                }
            }

            if (preparedMaxDate) {
                if (selectedDate > preparedMaxDate) {
                    return `Date must be on or before ${preparedMaxDate.toLocaleDateString()}`;
                }
            }

            return null;
        }
    });
}

const useSwal = (): UseSwalReturn => {
    return {
        handleSuccess,
        handleError,
        handleConfirmation,
        handleLoading,
        handleInputRequestNumber,
        handleInputRequestDate,
    };
};

export default useSwal;
