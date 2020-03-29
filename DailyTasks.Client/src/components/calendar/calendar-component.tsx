import { Component, h, State } from '@stencil/core';
import calendarService from './calendar-service';

@Component({
    tag: 'calendar-component',
    styleUrl: 'calendar-component.scss'
})
export class CalendarComponent {

    @State() currentMonth = new Date().getMonth() + 1;

    @State() currentYear = new Date().getFullYear();

    @State() numberOfDaysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

    months = calendarService.getMonths();

    changeDate(increment: number) {
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

        let date = new Date(this.currentYear, this.currentMonth - 1, day);

        let evt = new CustomEvent('dayChanged', { detail : date});
        
        window.dispatchEvent(evt);
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

        while (i <= this.numberOfDaysInMonth) {
            let dayOfTheWeek = new Date(this.currentYear, this.currentMonth - 1, i).getDay();
            
            switch (dayOfTheWeek) {
                case 0:
                    resultSunday.push(<span id={`${i}`} class="day" onClick={(e) => this.setCurrentDay(e)}>{i}</span>)
                    break;
                case 1:
                    resultMonday.push(<span id={`${i}`} class="day" onClick={(e) => this.setCurrentDay(e)}>{i}</span>)
                    break;
                case 2:
                    resultTuesday.push(<span id={`${i}`} class="day" onClick={(e) => this.setCurrentDay(e)}>{i}</span>)
                    break;
                case 3:
                    resultWednesday.push(<span id={`${i}`} class="day" onClick={(e) => this.setCurrentDay(e)}>{i}</span>)
                    break;
                case 4:
                    resultThursday.push(<span id={`${i}`} class="day" onClick={(e) => this.setCurrentDay(e)}>{i}</span>)
                    break;
                case 5:
                    resultFriday.push(<span id={`${i}`} class="day" onClick={(e) => this.setCurrentDay(e)}>{i}</span>)
                    break;
                case 6:
                    resultSaturday.push(<span id={`${i}`} class="day" onClick={(e) => this.setCurrentDay(e)}>{i}</span>)
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
            <div class="calendar">
                <div class="month-changeable">
                    <img class="img-arrow" decoding="async" src="/assets/svg/left-arrow.svg" onClick={() => this.changeDate(-1)}></img>
                    <span class="month-name">{this.renderCurrentMonthName()} - {this.currentYear}</span>
                    <img class="img-arrow" decoding="async" src="/assets/svg/right-arrow.svg" onClick={() => this.changeDate(+1)}></img>
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