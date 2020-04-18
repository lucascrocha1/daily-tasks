import { Component, h, Prop, State, Listen, Method } from '@stencil/core';
import dailyTaskService from '../daily-task-service';
import { Api } from '../../../base/interface';
import { formatDateAsString, getBase64 } from '../../../utils/utils';
import formValidation from '../../../base/form-validation';
import Quill from 'quill';

enum SegmentPage {
    Info = 1,
    Attachment = 2
}

@Component({
    tag: 'daily-task-insert-edit',
    styleUrl: 'daily-task-insert-edit.scss'
})
export class DailyTaskInsertEdit {
    @State() state: Api.DailyTask.InsertEdit.Command;

    @State() selectedDate: Date;

    @State() attachmentMessage: string = 'Clique ou arraste arquivos';

    @State() segment: SegmentPage = SegmentPage.Info;

    @Prop() taskId: number;

    @Prop() modalController: HTMLModalComponentElement;

    selectElement: HTMLSelectElement;

    loaderController: HTMLLoaderComponentElement;

    inputFileController: HTMLInputElement;

    divFileController: HTMLDivElement;

    form: HTMLFormElement;

    quillController: any;

    componentWillLoad() {
        this.loadState();
    }

    componentDidLoad() {
        this.registerQuill();
    }

    registerQuill() {
        let quillElement = document.getElementById('quill-element');

        this.quillController = new Quill(quillElement, {
            theme: 'snow'
        });
    }

    componentDidRender() {
        this.setStateValue();

        if (this.quillController && this.state && this.state.description)
            this.quillController.setContents(JSON.parse(this.state.description))
    }

    @Listen('dayChanged', { target: 'window' })
    async dayChangedHandler(e: CustomEvent) {
        this.state.date = formatDateAsString(e.detail.date);
    }

    setStateValue() {
        if (this.state && this.selectElement)
            this.selectElement.value = this.state.state as any;
    }

    @Method()
    async loadState() {
        if (this.taskId) {
            this.state = await dailyTaskService.get({ id: this.taskId });
            this.ensureOneDescriptionIsNull();

            this.selectedDate = new Date(this.state.date);
        }
        else {
            this.state = {
                date: formatDateAsString(new Date()),
                title: null,
                description: null,
                id: null,
                state: Api.DailyTask.DailyTaskStateEnum.New,
                checklists: [{
                    description: null,
                    done: false,
                    id: this.getLastChecklistId()
                }],
                attachments: []
            }
        }
    }

    getLastChecklistId() {
        if (!this.state || !this.state.checklists || !this.state.checklists.length)
            return -1;

        let lastChecklist = this.state.checklists.reverse()[0];

        let checklistId = lastChecklist.id;

        if (checklistId > 0)
            checklistId *= -1;

        return checklistId + -5;
    }

    handleDescriptionChange(e) {
        let value = e.target.value;

        this.state.description = value;
    }

    handleTitleChange(e) {
        let value = e.target.value;

        this.state.title = value;
    }

    ensureOneDescriptionIsNull() {
        let lastTask = this.state.checklists.slice(-1).pop();

        if (lastTask && !!lastTask.description)
            this.addNewTask()
    }

    addNewTask() {
        this.state.checklists.push({
            id: this.getLastChecklistId(),
            description: null,
            done: false
        })

        this.state = {
            ...this.state
        }
    }

    handleTaskChange(e, checklist: Api.DailyTask.InsertEdit.ChecklistDto) {
        let value = e.target.value;

        checklist.description = value;

        this.ensureOneDescriptionIsNull();
    }

    handleSelectChange(e) {
        this.state.state = +e.target.value;
    }

    checkboxChange(e, checkilist: Api.DailyTask.InsertEdit.ChecklistDto) {
        let checked = e.target.checked;
        checkilist.done = checked;
    }

    removeTaskItem(e, checklist: Api.DailyTask.InsertEdit.ChecklistDto) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        this.state.checklists = this.state.checklists.filter(e => e != checklist);

        this.state = {
            ...this.state
        }

        this.ensureOneDescriptionIsNull();
    }

    async submit(e) {
        e.preventDefault();

        let text = this.quillController.getText();

        if (text)
            this.state.description = JSON.stringify(this.quillController.getContents());

        formValidation.processRequest(this.form, async () => {
            if (this.taskId)
                await dailyTaskService.edit(this.state);
            else
                await dailyTaskService.insert(this.state);

            location.href = "/";

            await this.closeModal();
        });
    }

    dragEnter() {
        this.divFileController.classList.add('file-drag-enter')
    }

    dragLeave() {
        this.divFileController.classList.remove('file-drag-enter')
    }

    async fileChange(e: any) {
        await this.loaderController.show();

        let files = e.target.files as File[];

        for (let file of files) {
            let base64 = await getBase64(file);

            this.state.attachments.push({
                id: null,
                link: null,
                fileBase64: base64,
                fileName: file.name,
            })
        }

        this.state = {
            ...this.state
        }

        await this.loaderController.dismiss();
    }

    async closeModal() {
        formValidation.clearErrors(this.form);
        await this.modalController.dismiss();
    }

    removeAttachment(attachment: Api.DailyTask.InsertEdit.AttachmentDto) {
        this.state.attachments = this.state.attachments.filter(e => e != attachment);

        this.state = {
            ...this.state
        }
    }

    renderChecklist() {
        return (
            <div>
                <div class="task-title-background">
                    <span>Checklist</span>
                </div>
                <div>
                    {this.state.checklists.map(e => this.renderChecklistDto(e))}
                </div>
            </div>
        );
    }

    // toggle src: https://proto.io/freebies/onoff/
    renderChecklistDto(checklist: Api.DailyTask.InsertEdit.ChecklistDto) {
        let switchId = `switch-${checklist.id}`;

        return [
            <div class="checklist-item">
                <div class="btn-delete-background">
                    <button class="btn-delete-task" onClick={(e) => this.removeTaskItem(e, checklist)}>
                        <img class="img-delete-task" src="/assets/svg/delete.svg"></img>
                    </button>
                </div>
                <div class="input-outlined description-checklist">
                    <input
                        placeholder="Description"
                        value={checklist.description}
                        class="input"
                        onInput={(e => this.handleTaskChange(e, checklist))}
                        type="text">
                    </input>
                    <label class="label">Description</label>
                </div>
                <div class="done-background">
                    <div class="onoffswitch">
                        <input
                            type="checkbox"
                            onChange={e => this.checkboxChange(e, checklist)}
                            name="onoffswitch"
                            class="onoffswitch-checkbox"
                            checked={checklist.done}
                            id={switchId} />
                        <label class="onoffswitch-label" htmlFor={switchId}></label>
                    </div>
                </div>
            </div>
        ]
    }

    renderAttachment(attachment: Api.DailyTask.InsertEdit.AttachmentDto) {
        return (
            <div class="attachment-item">
                <span>
                    {attachment.fileName}
                </span>
                <img onClick={() => this.removeAttachment(attachment)} class="remove-attachment" src="/assets/svg/remove-attachment.svg"></img>
            </div>
        )
    }

    renderSegmentAttachment() {
        return (
            <div>
                <label>Anexos</label>
                <div class="attachment" ref={e => this.divFileController = e as any}>
                    <div>
                        <div class="upload-img-background">
                            <img class="upload-img" src="/assets/svg/upload.svg"></img>
                        </div>
                        <div>
                            <span>{this.attachmentMessage}</span>
                        </div>
                    </div>
                    <input
                        title="Clique ou arraste arquivos"
                        ref={e => this.inputFileController = e as any}
                        type="file"
                        class="input-file"
                        multiple
                        onChange={e => this.fileChange(e)}
                        onDragEnter={() => this.dragEnter()}
                        onDragLeave={() => this.dragLeave()}>
                    </input>
                </div>
                <div class="attachments-items">
                    {this.state.attachments.map(e => this.renderAttachment(e))}
                </div>
            </div>
        )
    }

    renderSegmentInfo() {
        return (
            <div>
                <div class="input-outlined">
                    <input
                        required
                        name="title"
                        placeholder="Title of the task"
                        value={this.state.title}
                        class="input"
                        onChange={(e => this.handleTitleChange(e))}
                        type="text">
                    </input>
                    <label class="label">Title</label>
                    <error-message name="title"></error-message>
                </div>
                <div class="input-outlined">
                    <div class="quill-element" id="quill-element"></div>
                    <input type="hidden" name="description"></input>
                    <error-message name="description"></error-message>
                </div>
                <div class="input-outlined">
                    <select
                        name="state"
                        ref={e => this.selectElement = e as any}
                        required
                        onChange={(e) => this.handleSelectChange(e)}
                        class="input select">
                        <option value={Api.DailyTask.DailyTaskStateEnum.New as any}>To do</option>
                        <option value={Api.DailyTask.DailyTaskStateEnum.Active as any}>Doing</option>
                        <option value={Api.DailyTask.DailyTaskStateEnum.Closed as any}>Done</option>
                    </select>
                    <error-message name="state"></error-message>
                </div>
                {this.renderChecklist()}
                <error-message name="checklist"></error-message>
            </div>
        );
    }

    render() {
        if (!this.state)
            return <center><spinner-component></spinner-component></center>

        return [
            <div>
                <div class="task-header">
                    <div class="img-cancel-background" onClick={() => this.closeModal()}>
                        <img class="img-cancel" src="/assets/svg/cancel.svg"></img>
                    </div>
                    <span class="task-header-title">
                        {this.taskId ? 'Edit' : 'Insert'} task
                    </span>
                </div>
                <div class="segment">
                    <div class={`segment-item ${this.segment == SegmentPage.Info && 'segment-selected'}`} onClick={() => this.segment = SegmentPage.Info}>
                        Informações
                    </div>
                    <div class={`segment-item ${this.segment == SegmentPage.Attachment && 'segment-selected'}`} onClick={() => this.segment = SegmentPage.Attachment}>
                        Anexos
                    </div>
                </div>
                <div class="daily-task-page">
                    <form ref={e => this.form = e as any} novalidate onSubmit={(e) => this.submit(e)}>
                        <div class="daily-task-form">
                            {
                                this.segment == SegmentPage.Info
                                    ? this.renderSegmentInfo()
                                    : this.renderSegmentAttachment()
                            }
                            <div class="btn-background">
                                <button type="submit" class="btn-confirm">Confirm</button>
                            </div>
                        </div>
                    </form >
                </div>
            </div>,
            <loader-component ref={e => this.loaderController = e as any}></loader-component>
        ]
    }
}