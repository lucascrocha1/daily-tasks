/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Api, } from "./base/interface";
export namespace Components {
    interface AppRoot {
    }
    interface CalendarComponent {
        "currentSelectedDate": Date;
        "dismiss": () => Promise<void>;
        "isVisible": () => Promise<boolean>;
        "show": () => Promise<void>;
    }
    interface CategoryList {
    }
    interface DailyTaskInsertEdit {
        "loadState": () => Promise<void>;
        "modalController": HTMLModalComponentElement;
        "taskId": number;
    }
    interface DailyTaskList {
    }
    interface DailyTaskOptions {
        "openClose": (e: any) => Promise<void>;
        "task": Api.DailyTask.List.DailyTaskDto;
    }
    interface ErrorMessage {
        "message": string;
        "name": string;
    }
    interface HeaderComponent {
    }
    interface LoaderComponent {
        "dismiss": () => Promise<void>;
        "show": () => Promise<void>;
    }
    interface LoginPage {
    }
    interface ModalComponent {
        "dismiss": () => Promise<void>;
        "present": () => Promise<void>;
    }
    interface SpinnerComponent {
    }
}
declare global {
    interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {
    }
    var HTMLAppRootElement: {
        prototype: HTMLAppRootElement;
        new (): HTMLAppRootElement;
    };
    interface HTMLCalendarComponentElement extends Components.CalendarComponent, HTMLStencilElement {
    }
    var HTMLCalendarComponentElement: {
        prototype: HTMLCalendarComponentElement;
        new (): HTMLCalendarComponentElement;
    };
    interface HTMLCategoryListElement extends Components.CategoryList, HTMLStencilElement {
    }
    var HTMLCategoryListElement: {
        prototype: HTMLCategoryListElement;
        new (): HTMLCategoryListElement;
    };
    interface HTMLDailyTaskInsertEditElement extends Components.DailyTaskInsertEdit, HTMLStencilElement {
    }
    var HTMLDailyTaskInsertEditElement: {
        prototype: HTMLDailyTaskInsertEditElement;
        new (): HTMLDailyTaskInsertEditElement;
    };
    interface HTMLDailyTaskListElement extends Components.DailyTaskList, HTMLStencilElement {
    }
    var HTMLDailyTaskListElement: {
        prototype: HTMLDailyTaskListElement;
        new (): HTMLDailyTaskListElement;
    };
    interface HTMLDailyTaskOptionsElement extends Components.DailyTaskOptions, HTMLStencilElement {
    }
    var HTMLDailyTaskOptionsElement: {
        prototype: HTMLDailyTaskOptionsElement;
        new (): HTMLDailyTaskOptionsElement;
    };
    interface HTMLErrorMessageElement extends Components.ErrorMessage, HTMLStencilElement {
    }
    var HTMLErrorMessageElement: {
        prototype: HTMLErrorMessageElement;
        new (): HTMLErrorMessageElement;
    };
    interface HTMLHeaderComponentElement extends Components.HeaderComponent, HTMLStencilElement {
    }
    var HTMLHeaderComponentElement: {
        prototype: HTMLHeaderComponentElement;
        new (): HTMLHeaderComponentElement;
    };
    interface HTMLLoaderComponentElement extends Components.LoaderComponent, HTMLStencilElement {
    }
    var HTMLLoaderComponentElement: {
        prototype: HTMLLoaderComponentElement;
        new (): HTMLLoaderComponentElement;
    };
    interface HTMLLoginPageElement extends Components.LoginPage, HTMLStencilElement {
    }
    var HTMLLoginPageElement: {
        prototype: HTMLLoginPageElement;
        new (): HTMLLoginPageElement;
    };
    interface HTMLModalComponentElement extends Components.ModalComponent, HTMLStencilElement {
    }
    var HTMLModalComponentElement: {
        prototype: HTMLModalComponentElement;
        new (): HTMLModalComponentElement;
    };
    interface HTMLSpinnerComponentElement extends Components.SpinnerComponent, HTMLStencilElement {
    }
    var HTMLSpinnerComponentElement: {
        prototype: HTMLSpinnerComponentElement;
        new (): HTMLSpinnerComponentElement;
    };
    interface HTMLElementTagNameMap {
        "app-root": HTMLAppRootElement;
        "calendar-component": HTMLCalendarComponentElement;
        "category-list": HTMLCategoryListElement;
        "daily-task-insert-edit": HTMLDailyTaskInsertEditElement;
        "daily-task-list": HTMLDailyTaskListElement;
        "daily-task-options": HTMLDailyTaskOptionsElement;
        "error-message": HTMLErrorMessageElement;
        "header-component": HTMLHeaderComponentElement;
        "loader-component": HTMLLoaderComponentElement;
        "login-page": HTMLLoginPageElement;
        "modal-component": HTMLModalComponentElement;
        "spinner-component": HTMLSpinnerComponentElement;
    }
}
declare namespace LocalJSX {
    interface AppRoot {
    }
    interface CalendarComponent {
        "currentSelectedDate"?: Date;
    }
    interface CategoryList {
    }
    interface DailyTaskInsertEdit {
        "modalController"?: HTMLModalComponentElement;
        "taskId"?: number;
    }
    interface DailyTaskList {
    }
    interface DailyTaskOptions {
        "onTaskUpdatedEvent"?: (event: CustomEvent<any>) => void;
        "task"?: Api.DailyTask.List.DailyTaskDto;
    }
    interface ErrorMessage {
        "message"?: string;
        "name"?: string;
    }
    interface HeaderComponent {
    }
    interface LoaderComponent {
    }
    interface LoginPage {
    }
    interface ModalComponent {
    }
    interface SpinnerComponent {
    }
    interface IntrinsicElements {
        "app-root": AppRoot;
        "calendar-component": CalendarComponent;
        "category-list": CategoryList;
        "daily-task-insert-edit": DailyTaskInsertEdit;
        "daily-task-list": DailyTaskList;
        "daily-task-options": DailyTaskOptions;
        "error-message": ErrorMessage;
        "header-component": HeaderComponent;
        "loader-component": LoaderComponent;
        "login-page": LoginPage;
        "modal-component": ModalComponent;
        "spinner-component": SpinnerComponent;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "app-root": LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
            "calendar-component": LocalJSX.CalendarComponent & JSXBase.HTMLAttributes<HTMLCalendarComponentElement>;
            "category-list": LocalJSX.CategoryList & JSXBase.HTMLAttributes<HTMLCategoryListElement>;
            "daily-task-insert-edit": LocalJSX.DailyTaskInsertEdit & JSXBase.HTMLAttributes<HTMLDailyTaskInsertEditElement>;
            "daily-task-list": LocalJSX.DailyTaskList & JSXBase.HTMLAttributes<HTMLDailyTaskListElement>;
            "daily-task-options": LocalJSX.DailyTaskOptions & JSXBase.HTMLAttributes<HTMLDailyTaskOptionsElement>;
            "error-message": LocalJSX.ErrorMessage & JSXBase.HTMLAttributes<HTMLErrorMessageElement>;
            "header-component": LocalJSX.HeaderComponent & JSXBase.HTMLAttributes<HTMLHeaderComponentElement>;
            "loader-component": LocalJSX.LoaderComponent & JSXBase.HTMLAttributes<HTMLLoaderComponentElement>;
            "login-page": LocalJSX.LoginPage & JSXBase.HTMLAttributes<HTMLLoginPageElement>;
            "modal-component": LocalJSX.ModalComponent & JSXBase.HTMLAttributes<HTMLModalComponentElement>;
            "spinner-component": LocalJSX.SpinnerComponent & JSXBase.HTMLAttributes<HTMLSpinnerComponentElement>;
        }
    }
}
