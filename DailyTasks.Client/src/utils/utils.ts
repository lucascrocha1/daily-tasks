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