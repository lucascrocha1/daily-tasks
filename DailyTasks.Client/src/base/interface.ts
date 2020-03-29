export interface IDailyTaskList {
    id: string,
    description: string,
    state: TaskState,
    createdAt: string,
    date: Date,
    quantityTasks: number,
    quantityTasksDone: number
}

export interface IDailyTaskInsertEdit {
    id: string,
    description: string,
    date: Date,
    taskItems: TaskItemDto[],
    state: TaskState
}

export interface TaskItemDto {
    id: string,
    description: string,
    done: boolean
}

export enum TaskState {
    New = 1,
    Active = 2,
    Closed = 3
}