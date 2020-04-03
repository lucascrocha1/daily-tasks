import { Component, h, State, Listen, Prop } from '@stencil/core';
import { formatDate } from '../../utils/utils';

@Component({
    tag: 'header-component',
    styleUrl: 'header-component.scss'
})
export class HeaderComponent {

    @State() currentDate: Date = new Date();

    @State() calendarHidden: boolean = true;

    @Prop() hideCalendar: boolean;

    @Prop() showBackButton: boolean;

    goToRoot() {
        window.location.href = "/";
    }

    componentDidLoad() {
        document.onclick = () => {
            this.calendarHidden = true;
        }
    }

    @Listen('dayChanged', { target: 'window' })
    dayChangedHandler(e: CustomEvent) {
        if (e.detail.ignoreDateChange)
            return;

        this.currentDate = e.detail.date;

        this.calendarHidden = true;
    }

    openCloseCalendar(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        this.calendarHidden = !this.calendarHidden;;
    }

    renderBackButton() {
        return (
            <div class="back-button" onClick={() => this.goToRoot()}>
                <img class="img-back-button" src="/assets/svg/back.svg"></img>
            </div>
        )
    }

    renderSearchbar() {
        return (
            <div class="toolbar-search">
                <input placeholder="Filtre por titulo, descrição ou data" />
            </div>
        )
    }

    render() {
        return [
            <div class="header-component">
                {this.showBackButton && this.renderBackButton()}
                <div class={`title-clickable ${this.showBackButton && 'back-button-enabled'}`} onClick={() => this.goToRoot()}>
                    <span class="title">Daily Tasks</span>
                </div>
                {
                    !this.hideCalendar &&
                    <div class="calendar-date" onClick={(e) => this.openCloseCalendar(e)}>
                        <div class="hidden-mobile">
                            <span class="date-font">{formatDate(this.currentDate)}</span>
                        </div>
                        <div class="calendar-image-background">
                            <img class="calendar-image" src="/assets/svg/calendar.svg"></img>
                        </div>
                    </div>
                }
            </div>,
            // this.renderSearchbar(),
            <calendar-component class={`calendar-component ${this.calendarHidden ? 'calendar-hidden' : 'calendar-open'}`} role="tooltip"></calendar-component>
        ];
    }
}