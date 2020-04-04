import { Component, h, State, Listen } from '@stencil/core';
import { formatDate } from '../../utils/utils';

@Component({
    tag: 'header-component',
    styleUrl: 'header-component.scss'
})
export class HeaderComponent {

    @State() currentDate: Date = new Date();

    calendarController: HTMLCalendarComponentElement;

    goToRoot() {
        window.location.href = "/";
    }

    @Listen('dayChanged', { target: 'window' })
    dayChangedHandler(e: CustomEvent) {
        console.log(e);
        if (e && e.detail && e.detail.date) {
            this.currentDate = e.detail.date;

            this.openCloseCalendar();
        }
    }

    async openCloseCalendar() {
        let calendarVisible = await this.calendarController.isVisible();
        
        if (!calendarVisible)
            this.calendarController.show();
        else
            this.calendarController.dismiss();
    }

    render() {
        return [
            <div class="header-component">
                <div class="title-clickable" onClick={() => this.goToRoot()}>
                    <span class="title">Daily Tasks</span>
                </div>
                <div class="calendar-date" onClick={() => this.openCloseCalendar()}>
                    <div class="hidden-mobile">
                        <span class="date-font">{formatDate(this.currentDate)}</span>
                    </div>
                    <div class="calendar-image-background">
                        <img class="calendar-image" src="/assets/svg/calendar.svg"></img>
                    </div>
                </div>
            </div>,
            <calendar-component ref={e => this.calendarController = e as any}></calendar-component>
        ];
    }
}