export interface IDailyTaskList {
    id: string,
    description: string,
    state: TaskState,
    createdAt: string,
    date: Date,
    quantityTasks: number,
    quantityTasksDone: number,
    taskItems: TaskItemDto[]
}

export interface IDailyTaskInsertEdit {
    id: string,
    description: string,
    date: string,
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