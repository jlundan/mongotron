import { DOM } from 'aurelia-pal';
import { transient } from 'aurelia-dependency-injection';
import { DialogController, Renderer } from 'aurelia-dialog';
import * as $ from 'jquery';

let body: HTMLBodyElement;

export class BootstrapDialogRenderer implements Renderer {
    public host: Element;
    public anchor: Element;

    private dialog: any;

    private attach(dialogController: DialogController): void {

        this.host.appendChild(this.anchor);
        let options = Object.assign(dialogController.settings, {
            show: false,
        });
        this.dialog = $(this.anchor.firstElementChild).modal(options);
        dialogController.controller.attached();
    }

    public getDialogContainer(): Element {
        return this.anchor || (this.anchor = DOM.createElement('div'));
    }

    public showDialog(dialogController: DialogController): Promise<void> {
        return new Promise((resolve) => {
            if (!body) {
                body = DOM.querySelectorAll('body')[0] as HTMLBodyElement;
            }
            if (dialogController.settings.host) {
                this.host = dialogController.settings.host;
            } else {
                this.host = body;
            }
            const settings = dialogController.settings;
            this.attach(dialogController);


            $(this.anchor.firstElementChild).on('hidden.bs.modal', () => {
                return dialogController.cancel(null);
            });

            $(this.anchor.firstElementChild).on('shown.bs.modal', () => {
                $(this.anchor).off('shown.bs.modal');
                resolve();
            });

            this.dialog.modal('show');
        });
    }

    public hideDialog(dialogController: DialogController) {
        this.dialog.modal('hide');
        return Promise.resolve();
    }
}

// avoid unnecessary code
transient()(BootstrapDialogRenderer);
