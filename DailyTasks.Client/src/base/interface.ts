export module Api {
    export module DailyTask {
        export module List {
            export interface Query {
                date: string;
                pageSize: number;
                pageIndex: number;
                categoryId?: number;
                state?: DailyTaskStateEnum;
            }

            export interface DailyTaskDto {
                id: number;
                date: string;
                title: string;
                categoryId?: number;
                quantityTasks: number;
                quantityTasksDone: number;
                state: DailyTaskStateEnum;
                checklists: ChecklistDto[];
                categoryDescription: string;
            }

            export interface ChecklistDto {
                id: number;
                done: boolean;
                description: string;
            }
        }

        export module Get {
            export interface Query {
                id: number;
            }

            export interface Dto {
                id: number;
                date: string;
                title: string;
                description: string;
                comments: CommentsDto[];
                state: DailyTaskStateEnum;
                checklists: ChecklistDto[];
            }

            export interface CommentsDto {
                id: number;
                comment: string;
                createdBy: string;
                createdAt: string;
            }

            export interface ChecklistDto {
                id: number;
                done: boolean;
                description: string;
            }
        }

        export module InsertEdit {
            export interface Command {
                id?: number;
                date: string;
                title: string;
                description: string;
                state: DailyTaskStateEnum;
                checklists: ChecklistDto[];
            }

            export interface ChecklistDto {
                id?: number;
                done: boolean;
                description: string;
            }
        }

        export module SetAllTasksDone {
            export interface Command {
                id: number;
            }
        }

        export module UpdateState {
            export interface Command {
                id: number;
                state: DailyTaskStateEnum;
            }
        }

        export module Delete {
            export interface Command {
                id: number;
            }
        }

        export enum DailyTaskStateEnum {
            New = 1,
            Active = 2,
            Closed = 3
        }
    }

    export module Category {
        export module Get {
            export interface Query {
                id: number;
            }

            export interface Dto {
                id: number;
                description: string;
            }
        }

        export module List {
            export interface Query {
                pageSize: number;
                pageIndex: number;
            }

            export interface Dto {
                id: number;
                description: string;
            }
        }

        export module InsertEdit {
            export interface Command {
                id: number;
                description: string;
            }
        }

        export module Delete {
            export interface Command {
                id: number;
            }
        }
    }
}