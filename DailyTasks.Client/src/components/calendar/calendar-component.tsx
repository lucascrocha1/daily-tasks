import { Component, h, State, Prop } from '@stencil/core';
import calendarService from './calendar-service';

@Component({
    tag: 'calendar-component',
    styleUrl: 'calendar-component.scss'
})
export class CalendarComponent {
    @State() currentMonth = new Date().getMonth() + 1;

    @State() currentYear = new Date().getFullYear();

    @State() currentDay = new Date().getDate();

    @State() selectedDate = new Date(this.currentYear, this.currentMonth - 1, this.currentDay);

    @State() numberOfDaysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

    @Prop() currentSelectedDate: Date;

    @Prop() ignoreDateChange: boolean;

    months = calendarService.getMonths();

    componentWillLoad() {
        if (this.currentSelectedDate)
            this.setSelectedDate();
    }

    setSelectedDate() {
        this.currentDay = this.currentSelectedDate.getDate();
        this.currentMonth = this.currentSelectedDate.getMonth() + 1;
        this.currentYear = this.currentSelectedDate.getFullYear();
        this.selectedDate = this.currentSelectedDate;
        this.numberOfDaysInMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
    }

    changeDate(e, increment: number) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        this.currentMonth += increment;

        if (this.currentMonth > 12) {
            this.currentMonth = 1;
            this.currentYear += 1;
        }

        if (this.currentMonth < 1) {
            this.currentMonth = 12;
            this.currentYear -= 1;
        }

        this.numberOfDaysInMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
    }

    renderCurrentMonthName() {
        return this.months.find(e => e.number == this.currentMonth).name;
    }

    setCurrentDay(e) {
        let day = +e.srcElement.id;

        this.currentDay = day;

        let date = new Date(this.currentYear, this.currentMonth - 1, day);

        this.selectedDate = date;

        let evt = new CustomEvent('dayChanged', {
            detail: {
                date,
                ignoreDateChange: this.ignoreDateChange
            }
        });

        window.dispatchEvent(evt);
    }

    keepCalendarOpen(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }

    renderDays() {
        let resultSunday = [];
        let resultMonday = [];
        let resultTuesday = [];
        let resultWednesday = [];
        let resultThursday = [];
        let resultFriday = [];
        let resultSaturday = [];

        let i = 1;

        let today = new Date();

        while (i <= this.numberOfDaysInMonth) {
            let dateFilter = new Date(this.currentYear, this.currentMonth - 1, i);
            let dayOfTheWeek = dateFilter.getDay();
            let currentDay = today.getDate() == i && dateFilter.getMonth() == today.getMonth() && dateFilter.getFullYear() == today.getFullYear();
            let selectedDay = this.selectedDate.getMonth() == dateFilter.getMonth() && this.currentDay == i;

            switch (dayOfTheWeek) {
                case 0:
                    resultSunday.push(<span id={`${i}`} class={`day ${currentDay && 'current-day'} ${selectedDay && 'selected-day'}`} onClick={(e) => this.setCurrentDay(e)}>{i}</span>)
                    break;
                case 1:
                    resultMonday.push(<span id={`${i}`} class={`day ${currentDay && 'current-day'} ${selectedDay && 'selected-day'}`} onClick={(e) => this.setCurrentDay(e)}>{i}</span>)
                    break;
                case 2:
                    resultTuesday.push(<span id={`${i}`} class={`day ${currentDay && 'current-day'} ${selectedDay && 'selected-day'}`} onClick={(e) => this.setCurrentDay(e)}>{i}</span>)
                    break;
                case 3:
                    resultWednesday.push(<span id={`${i}`} class={`day ${currentDay && 'current-day'} ${selectedDay && 'selected-day'}`} onClick={(e) => this.setCurrentDay(e)}>{i}</span>)
                    break;
                case 4:
                    resultThursday.push(<span id={`${i}`} class={`day ${currentDay && 'current-day'} ${selectedDay && 'selected-day'}`} onClick={(e) => this.setCurrentDay(e)}>{i}</span>)
                    break;
                case 5:
                    resultFriday.push(<span id={`${i}`} class={`day ${currentDay && 'current-day'} ${selectedDay && 'selected-day'}`} onClick={(e) => this.setCurrentDay(e)}>{i}</span>)
                    break;
                case 6:
                    resultSaturday.push(<span id={`${i}`} class={`day ${currentDay && 'current-day'} ${selectedDay && 'selected-day'}`} onClick={(e) => this.setCurrentDay(e)}>{i}</span>)
                    break;
            }

            i++;
        }

        let monthStartsInDay = new Date(this.currentYear, this.currentMonth - 1, 1);

        // ToDo: find a better way to do this
        if (monthStartsInDay.getDay() != 0) {
            i = 0;
            while (i < monthStartsInDay.getDay()) {
                switch (i) {
                    case 0:
                        resultSunday.unshift(<span class="day-hidden">0</span>)
                        break;
                    case 1:
                        resultMonday.unshift(<span class="day-hidden">0</span>)
                        break;
                    case 2:
                        resultTuesday.unshift(<span class="day-hidden">0</span>)
                        break;
                    case 3:
                        resultWednesday.unshift(<span class="day-hidden">0</span>)
                        break;
                    case 4:
                        resultThursday.unshift(<span class="day-hidden">0</span>)
                        break;
                    case 5:
                        resultFriday.unshift(<span class="day-hidden">0</span>)
                        break;
                    case 6:
                        resultSaturday.unshift(<span class="day-hidden">0</span>)
                        break;
                }

                i++;
            }
        }

        return [
            <div class="calendar-days-week">
                {...resultSunday}
            </div>,
            <div class="calendar-days-week">
                {...resultMonday}
            </div>,
            <div class="calendar-days-week">
                {...resultTuesday}
            </div>,
            <div class="calendar-days-week">
                {...resultWednesday}
            </div>,
            <div class="calendar-days-week">
                {...resultThursday}
            </div>,
            <div class="calendar-days-week">
                {...resultFriday}
            </div>,
            <div class="calendar-days-week">
                {...resultSaturday}
            </div>
        ];
    }

    render() {
        return (
            <div class="calendar" onClick={(e) => this.keepCalendarOpen(e)}>
                <div class="month-changeable">
                    <img class="img-arrow" decoding="async" src="/assets/svg/left-arrow.svg" onClick={(e) => this.changeDate(e, -1)}></img>
                    <span class="month-name">{this.renderCurrentMonthName()} - {this.currentYear}</span>
                    <img class="img-arrow" decoding="async" src="/assets/svg/right-arrow.svg" onClick={(e) => this.changeDate(e, +1)}></img>
                </div>
                <div class="months">
                    <div class="calendar-days">
                        <span>D</span>
                        <span>S</span>
                        <span>T</span>
                        <span>Q</span>
                        <span>Q</span>
                        <span>S</span>
                        <span>S</span>
                    </div>
                    <div class="calendar-days-weeks">
                        {this.renderDays()}
                    </div>
                </div>
            </div>
        );
    }
}