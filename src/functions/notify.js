import { Notify } from "quasar";
//typeOf can have 3 values : Success, Failed, Warning
//usage:-
//   import {notify} from 'src/functions/notify.js';
//   notify('Success', 'Your data is saved!');

export function notify(typeOf, message) {
    var color, image, html;

    if (typeOf == "Success") {
        color = "#49C85F";
        image = "positivepng.png";
    } else if (typeOf == "Failed") {
        color = "#FC887B";
        image = "negativepng.png";
    } else {
        color = "#FFCC84";
        image = "warningpng.png";
    }
    var html = `
            <div style="padding:35px 25px 35px 0px;height:30px;display:flex;align-items:center;">
                <div style="float:left;border-left:solid 5px;border-color:${color};height:3.5rem;margin-right:15px;">
                </div>
                <div style="margin-right:15px">
                <image src="${image}" alt="image" style="width: 3.5rem; height: 3.5rem">
                </div>
                <div style="float:left;min-width:400px">
                    <div style="font-size:20px;font-weight:bold">
                        ${typeOf}
                    </div>
                    <div>
                        ${message}
                    </div>
                </div>
            </div>
        `;
    var notifyObject = {
        classes: "bg-white text-black q-pl-sm",
        message: html,
        actions: [{
        icon: "close",
        color: "black",
        size: ""
        }],
        position: "bottom-right",
        html: true
    };

    Notify.create(notifyObject);
}
