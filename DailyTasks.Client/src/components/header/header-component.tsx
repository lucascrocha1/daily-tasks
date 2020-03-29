import { Component, h, State, Listen } from '@stencil/core';
import { formatDate } from '../../utils/utils';
import { createPopper } from '@popperjs/core';

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

    @Listen('window:dayChanged') 
    dayChangedHandler(e: CustomEvent) {
        this.currentDate = e.detail;

        this.calendarHidden = true;
    }

    openCalendar() {
        if (!this.calendarHidden) {
            this.calendarHidden = true;
            return;
        }
        
        let calendarOpener = document.querySelector('.calendar-date');
        let calendar = document.querySelector('calendar-component');

        createPopper(calendarOpener, calendar, {
            placement: 'bottom',
            modifiers: [{
                name: 'preventOverflow',
                options: {
                    boundary: calendarOpener
                }
            }]
        });

        this.calendarHidden = false;
    }

    render() {
        return [
            <div class="header-component">
                <div class="title-clickable" onClick={() => this.goToRoot()}>
                    <span class="title">Daily Tasks</span>
                </div>
                <div class="calendar-date" onClick={() => this.openCalendar()}>
                    <div>
                        <span class="date-font">{formatDate(this.currentDate)}</span>
                    </div>
                    <div class="calendar-image-background">
                        <img class="calendar-image" src="/assets/svg/calendar.svg"></img>
                    </div>
                </div>
            </div>,
            <calendar-component class="calendar-component" hidden={this.calendarHidden} role="tooltip"></calendar-component>
        ];
    }
}