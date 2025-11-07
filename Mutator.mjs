
/*
 * This is a Sobamail application.
 * See https://sobamail.com for more info
 */

import "soba://computer/R1";

import {
    DeleteRow,
    Message,
} from "https://sobamail.com/module/base/v1?sha224=LbfSklK0ZN9Fqv2PUhX7gN4BidTZ0oqseuYDTA";

export default class Mutator {
    static id = "counter.burak.user.app.mailous.com";
    static name = "Counter";
    static version = "1.0.0.0";
    static objects = new Map([
        [ DeleteRow.KEY, false ],
    ]);

    constructor() {
        // TODO: Create the database schema
        // TODO: Perform any sanity checks
    }

    process(message, metadata) {
        // TODO: Implement the app logic
    }
}
