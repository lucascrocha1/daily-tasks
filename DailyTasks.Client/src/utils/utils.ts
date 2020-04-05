import dayjs from 'dayjs';

export function formatDateString(date: string) {
    return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' }).format(new Date(date));
}

export function formatDate(date: Date) {
    return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date));
}

export function formatDateCalendar(date: Date) {
    let opts = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return new Intl.DateTimeFormat('pt-BR', opts).format(date);
}

export function formatDateAsString(date: Date): string {
    return dayjs(date).format('YYYY-MM-DDTHH:mm:ssZ')
}

export function validateDate(day: string, month: string, year: string) {
    let date = `${year}/${month}/${day}`;
    let format = 'YYYY/MM/DD';

    return dayjs(date, format).format(format) === date;
}

export function maskDate(e: any, value: string) {
    if (!value)
        return;

    value = value.trim();

    let lastChar = value.substr(value.length - 1);

    let regex = /^\d+$/;

    if (!regex.test(lastChar)) {
        e.srcElement.value = value.substring(0, value.length - 1);
        return;
    }

    if (value.length == 2 || value.length == 5)
        value += '/';

    return value;
}

export function getBase64(file: File) {
    return new Promise<string>((resolve) => {
        let reader = new FileReader() as any;

        reader.readAsDataURL(file);

        reader.onload = () => {
            let result = reader.result as string;

            result = result.split(',')[1];

            resolve(result)
        };
    });
}