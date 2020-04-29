import { Component, h, State, Prop, Method } from '@stencil/core';
import calendarService from './calendar-service';
import { formatDateCalendar, validateDate, maskDate, formatDate } from '../../../utils/utils';

enum DateType {
    Calendar = 1,
    Input = 2
}

@Component({
    tag: 'calendar-component',
    styleUrl: 'calendar-component.scss'
})
export class CalendarComponent {
    @State() hidden: boolean = true;

    @State() currentMonth = new Date().getMonth() + 1;

    @State() currentYear = new Date().getFullYear();

    @State() currentDay = new Date().getDate();

    @State() selectedDate = new Date(this.currentYear, this.currentMonth - 1, this.currentDay);

    @State() numberOfDaysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

    @State() dateType: DateType = DateType.Calendar;

    @State() data: string = '';

    @State() dateHasError: boolean = false;

    @State() headerInputCalendar: string = 'Entre com a data';

    @Prop() currentSelectedDate: Date;

    months = calendarService.getMonths();

    monthController: HTMLDivElement;

    swipeRegistered: boolean = false;

    componentWillLoad() {
        if (this.currentSelectedDate)
            this.setSelectedDate();
    }

    componentDidRender() {
        if (this.monthController && !this.swipeRegistered)
            this.registerSwipe();
    }

    @Method()
    async show() {
        this.hidden = false;
    }

    @Method()
    async dismiss() {
        this.hidden = true;
        this.dateType = DateType.Calendar;
        this.data = '';
    }

    @Method()
    async isVisible() {
        return !this.hidden;
    }

    registerSwipe() {
        this.swipeRegistered = true;

        let touchStartX = 0;
        let touchStartY = 0;

        this.monthController.addEventListener('touchstart', e => {
            let touch = e.touches[0];

            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        });

        this.monthController.addEventListener('touchend', (e) => {
            let x = e.changedTouches[0].clientX;
            let y = e.changedTouches[0].clientY;

            let diffX = touchStartX - x;
            let diffY = touchStartY - y;

            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX < 0) {
                    this.changeDate(- 1);
                    return false;
                }
                else {
                    this.changeDate(+ 1);
                    return false;
                }
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

    setDateType(dateType: DateType) {
        this.dateType = dateType;
    }

    renderCurrentMonthName() {
        return this.months.find(e => e.number == this.currentMonth).name;
    }

    setCurrentDay(e) {
        let day = +e.srcElement.id;

        this.currentDay = day;

        let date = new Date(this.currentYear, this.currentMonth - 1, day);

        this.selectedDate = date;
    }

    getCurrentFormatedDate() {
        let date = formatDateCalendar(this.selectedDate);

        return date.charAt(0).toUpperCase() + date.slice(1);
    }

    inputDataChange(e) {
        let value = e.target.value as string;

        let formatedDate = maskDate(e, value);

        if (!formatDate)
            return;

        this.dateHasError = false;

        this.data = formatedDate;

        if (this.data && this.data.length < 10)
            return;

        let dateWithoutBar = this.data.split('/').join('');

        let day = dateWithoutBar.substring(0, 2);
        let month = dateWithoutBar.substring(2, 4);
        let year = dateWithoutBar.substring(4, dateWithoutBar.length);

        if (!validateDate(day, month, year)) {
            this.headerInputCalendar = 'Entre com a data';
            this.dateHasError = true;
            return;
        }

        let data = new Date(+year, +month, +day);

        this.currentDay = data.getDate();
        this.currentMonth = data.getMonth();
        this.currentYear = data.getFullYear();
        this.selectedDate = new Date(this.currentYear, this.currentMonth - 1, this.currentDay);

        this.headerInputCalendar = this.getCurrentFormatedDate()
    }

    confirm() {
        let evt = new CustomEvent('dayChanged', {
            detail: {
                date: this.selectedDate
            }
        });

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

        let today = new Date();

        while (i <= this.numberOfDaysInMonth) {
            let dateFilter = new Date(this.currentYear, this.currentMonth - 1, i);
            let dayOfTheWeek = dateFilter.getDay();
            let currentDay = today.getDate() == i && dateFilter.getMonth() == today.getMonth() && dateFilter.getFullYear() == today.getFullYear();
            let selectedDay = this.selectedDate.getMonth() == dateFilter.getMonth() && this.currentDay == i && this.selectedDate.getFullYear() == this.currentYear;

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

    renderButtons() {
        return (
            <div class="btns-calendar">
                <button onClick={() => this.dismiss()} class="btn-clear btn-secondary">
                    Cancelar
                </button>
                <button onClick={() => this.confirm()} class="btn-clear btn-secondary">
                    OK
                </button>
            </div>
        );
    }

    renderCalendar() {
        return (
            <div class="calendar">
                <div class="calendar-header">
                    <div class="selecionar-data-title">
                        <span class="selecionar-data">Selecionar data</span>
                    </div>
                    <div class="title-background">
                        <div>
                            <span class="calendar-title">{this.getCurrentFormatedDate()}</span>
                        </div>
                        <div class="edit-date-background" onClick={() => this.setDateType(DateType.Input)}>
                            <img decoding="async" class="edit-date" src="/assets/svg/edit.svg"></img>
                        </div>
                    </div>
                </div>
                <div class="calendar-body">
                    <div class="months-changeable">
                        <div>
                            <span class="month-name">{this.renderCurrentMonthName()} {this.currentYear}</span>
                        </div>
                        <div class="months-img">
                            <img class="img-arrow img-arrow-left" decoding="async" src="/assets/svg/left-arrow.svg" onClick={() => this.changeDate(-1)}></img>
                            <img class="img-arrow" decoding="async" src="/assets/svg/right-arrow.svg" onClick={() => this.changeDate(+1)}></img>
                        </div>
                    </div>
                    {this.renderMonths()}
                    {this.renderButtons()}
                </div>
            </div>
        );
    }

    renderCalendarInput() {
        return (
            <div class="calendar">
                <div class="calendar-header">
                    <div class="selecionar-data-title">
                        <span class="selecionar-data">Digitar data</span>
                    </div>
                    <div class="title-background title-input">
                        <div>
                            <span class="calendar-title">{this.headerInputCalendar}</span>
                        </div>
                        <div class="edit-date-background" onClick={() => this.setDateType(DateType.Calendar)}>
                            <img decoding="async" class="edit-date" src="/assets/svg/calendar-component.svg"></img>
                        </div>
                    </div>
                </div>
                <div class="calendar-body body-input">
                    <div class="input-background">
                        <div class="input-outlined">
                            <input class={`input ${this.dateHasError && 'input-error'}`} onInput={(e) => this.inputDataChange(e)} placeholder="dd/mm/yyyy" value={this.data} maxlength={10} />
                            <label class="label">Data</label>
                            {this.dateHasError && <span class="span-error">Data inválida.</span>}
                        </div>
                    </div>
                    {this.renderButtons()}
                </div>
            </div>
        )
    }

    render() {
        if (this.hidden)
            return null;

        return [
            this.dateType == DateType.Calendar ? this.renderCalendar() : this.renderCalendarInput(),
            <div onClick={() => this.dismiss()} class="calendar-backdrop"></div>
        ];
    }
}