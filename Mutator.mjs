
/*
 * Mutator module for the Click Counter tutorial
 * For more information, visit https://sobamail.com/docs
 */

import "soba://computer/R1";

import {
    AddCounter,
    CounterValueGet,
    CounterValuePut,
    IncrementRequest,
} from "https://github.com/sobamail/counter/model/v1"
import {
    DeleteRow,
    Message,
} from "https://sobamail.com/module/base/v1?sha224=LbfSklK0ZN9Fqv2PUhX7gN4BidTZ0oqseuYDTA";

export default class Mutator {
    static id = "counter.burak.user.app.mailous.com";
    static name = "Counter";
    static version = "1.0.0.0";
    static objects = new Map([
        [ AddCounter.KEY, false ],
        [ DeleteRow.KEY, false ],
        [ IncrementRequest.KEY, false ],
        [ CounterValueGet.KEY, false ],
        [ CounterValuePut.KEY, false ],
    ]);

    constructor() {
        soba.schema.table({
            name : "counter",
            insertEvent : AddCounter,
            deleteEvent : DeleteRow,
            columns : [
                {
                    name : "name",
                    checks : [
                        {op : "!=", value : null},
                        {op : "lww", value : true},
                        {op : "typeof", value : "text"},
                    ],
                },
                {
                    name : "value",
                    checks : [
                        {op : "!=", value : null},
                        {op : "typeof", value : "integer"},
                    ],
                },

            ],
        });
    }

    process(message, meta) {
        let object = Message.extractObject(message, meta);
        if (! object) {
            soba.log.info("Unrecognized content");
            return;
        }

        let key = `{${object.namespace}}${object.name}`;
        let content = object.content;

        if (key == AddCounter.KEY) {
            // This is a mutation, so write it straight into the database
            return soba.data.insert("counter", object);
        }

        // ui request
        if (key == CounterValueGet.KEY) {
            const rows = soba.db.exec("SELECT value FROM counter WHERE name='counter'").data;
            let value = 0;
            if (rows.length > 0) {
                value = rows[0][0];
            }

            let resp = new CounterValuePut();
            resp.value = value;
            return soba.task.respond(resp);
        }

        // ui request
        if (key == IncrementRequest.KEY) {
            if (! content.value) {
                throw new Error("IncrementRequest.value is empty or zero");
            }

            let parent = soba.data.findLast("counter", {name : "counter"});
            if (! parent.object) {
                soba.data.insert("counter", {
                    name : "counter",
                    value : content.value,
                });
            }
            else {
                soba.data.update("counter", {
                    parent : parent.hash,
                    column : "value",
                    op : "+",
                    value : content.value,
                },
                        {uuid : soba.type.uuid.v4()});
            }

            return;
        }

        soba.log.warning(`Unhandled object ${key}`);
    }
}
