import { Component, h, State } from '@stencil/core';
import { Api } from '../../../../base/interface';
import categoryService from '../category-service';

@Component({
    tag: 'category-list'
})
export class CategoryList {
    @State() state: Api.Category.List.Dto[];

    pageIndex: number = 1;

    pageSize: number = 20;

    componentWillLoad() {
        this.loadState();
    }

    async loadState() {
        this.state = await categoryService.list({
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
        });
    }

    render() {
        return (
            <div></div>
        )
    }
}