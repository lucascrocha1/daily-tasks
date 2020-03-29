import { Component, h, State, Listen } from '@stencil/core';
import { formatDate } from '../../utils/utils';

@Component({
    tag: 'header-component',
    styleUrl: 'header-component.scss'
})
export class HeaderComponent {

    @State() currentDate: Date = new Date();

    @State() calendarHidden: boolean = true;

    goToRoot() {
        window.location.href = "/";
    }

    componentDidLoad() {
        document.onclick = () => {
            this.calendarHidden = true;
        }
    }

    @Listen('window:dayChanged') 
    dayChangedHandler(e: CustomEvent) {
        this.currentDate = e.detail;

        this.calendarHidden = true;
    }

    openCloseCalendar(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        this.calendarHidden = !this.calendarHidden;;
    }

    render() {
        return [
            <div class="header-component">
                <div class="title-clickable" onClick={() => this.goToRoot()}>
                    <span class="title">Daily Tasks</span>
                </div>
                <div class="calendar-date" onClick={(e) => this.openCloseCalendar(e)}>
                    <div class="hidden-mobile">
                        <span class="date-font">{formatDate(this.currentDate)}</span>
                    </div>
                    <div class="calendar-image-background">
                        <img class="calendar-image" src="/assets/svg/calendar.svg"></img>
                    </div>
                </div>
            </div>,
            <calendar-component class={`calendar-component ${this.calendarHidden ? 'calendar-hidden' : 'calendar-open'}`} role="tooltip"></calendar-component>
        ];
    }
}