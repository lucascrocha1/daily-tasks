import { Component, h, State, Prop } from '@stencil/core';
import calendarService from './calendar-service';
import { formatDateCalendar } from '../../utils/utils';

enum SegmentEnum {
    Months = 1,
    Year = 2
}

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

    @State() segmentSelected: SegmentEnum;

    @Prop() currentSelectedDate: Date;

    @Prop() ignoreDateChange: boolean;

    months = calendarService.getMonths();

    monthController: HTMLDivElement;

    componentWillLoad() {
        this.segmentSelected = SegmentEnum.Months;

        if (this.currentSelectedDate)
            this.setSelectedDate();
    }

    registerSwipe() {
        let touchStartX = 0;
        let touchStartY = 0;

        let rect = this.monthController.getBoundingClientRect();;
        //let monthHeight = rect.height;
        let monthWidth = rect.width;
        

        this.monthController.addEventListener('touchstart', e => {
            let touch = e.touches[0];

            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        });

        this.monthController.addEventListener('touchmove', (e) => {
            if (!touchStartX || !touchStartY)
                return;

            let x = e.touches[0].clientX;
            let y = e.touches[0].clientY;

            let diffX = touchStartX - x;
            let diffY = touchStartY - y;

            console.log(diffX);

            if (Math.abs(diffX) > Math.abs(diffY) && (Math.abs(diffX) > monthWidth)) {
                if (diffX > 0)
                    this.changeDate(null, - 1);
                else
                    this.changeDate(null, + 1);
            }
        });
    }

    setSelectedDate() {
        this.currentDay = this.currentSelectedDate.getDate();
        this.currentMonth = this.currentSelectedDate.getMonth() + 1;
        this.currentYear = this.currentSelectedDate.getFullYear();
        this.selectedDate = this.currentSelectedDate;
        this.numberOfDaysInMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
    }

    changeDate(e, increment: number) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }

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

    getCurrentFormatedDate() {
        let date = formatDateCalendar(this.selectedDate);

        return date.charAt(0).toUpperCase() + date.slice(1);
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
                        resultSunday.unshift(<span class="day day-hidden">0</span>)
                        break;
                    case 1:
                        resultMonday.unshift(<span class="day day-hidden">0</span>)
                        break;
                    case 2:
                        resultTuesday.unshift(<span class="day day-hidden">0</span>)
                        break;
                    case 3:
                        resultWednesday.unshift(<span class="day day-hidden">0</span>)
                        break;
                    case 4:
                        resultThursday.unshift(<span class="day day-hidden">0</span>)
                        break;
                    case 5:
                        resultFriday.unshift(<span class="day day-hidden">0</span>)
                        break;
                    case 6:
                        resultSaturday.unshift(<span class="day day-hidden">0</span>)
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

    renderMonths() {
        return (
            <div ref={e => this.monthController = e as any} class="months">
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
        )
    }

    renderYears() {
        return (
            <div>

            </div>
        )
    }

    render() {
        return [
            <div class="calendar" onLoad={() => this.registerSwipe()} onClick={(e) => this.keepCalendarOpen(e)}>
                <div class="calendar-header">
                    <div class="selecionar-data-title">
                        <span class="selecionar-data">Selecionar data</span>
                    </div>
                    <div class="title-background">
                        <div>
                            <span class="calendar-title">{this.getCurrentFormatedDate()}</span>
                        </div>
                        <div>
                            <img decoding="async" class="edit-date" src="/assets/svg/edit.svg"></img>
                        </div>
                    </div>
                </div>
                <div class="months-changeable">
                    <div class="year-selector">
                        <div>
                            <span class="month-name">{this.renderCurrentMonthName()} {this.currentYear}</span>
                        </div>
                        <div>
                            <img decoding="async" class="img-select" src="/assets/svg/down-arrow-select.svg"></img>
                        </div>
                    </div>
                    <div class="months-img">
                        <img class="img-arrow img-arrow-left" decoding="async" src="/assets/svg/left-arrow.svg" onClick={(e) => this.changeDate(e, -1)}></img>
                        <img class="img-arrow" decoding="async" src="/assets/svg/right-arrow.svg" onClick={(e) => this.changeDate(e, +1)}></img>
                    </div>
                </div>
                {
                    this.segmentSelected == SegmentEnum.Months
                        ? this.renderMonths()
                        : this.renderYears()
                }
                <div class="btns-calendar">
                    <button class="btn-clear btn-secondary">
                        Cancelar
                    </button>
                    <button class="btn-clear btn-secondary">
                        OK
                    </button>
                </div>
            </div>,
            <div class="calendar-backdrop"></div>
        ];
    }
}