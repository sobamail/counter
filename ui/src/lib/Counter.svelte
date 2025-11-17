<script lang="ts">
    import { encode, decode } from "@msgpack/msgpack";
    export const namespace = `https://github.com/sobamail/counter/model/v1`;

    async function incrementRequest(value: number) {
        const requestData = encode({
            namespace: namespace,
            name: "IncrementRequest",
            content: { value: value },
        });

        const response = await fetch("/api/v2/object", {
            method: "POST",
            headers: {
                "Content-Type": "application/msgpack",
            },
            body: requestData,
        });

        if (!response.ok) {
            return;
        }

        const responseData = await response.arrayBuffer();
        if (responseData.byteLength == 0) {
            return;
        }

        return decode(responseData).content;
    }

    async function readCounterValue() {
        const requestData = encode({
            namespace: namespace,
            name: "CounterValueGet",
            content: {},
        });

        const response = await fetch("/api/v2/object", {
            method: "POST",
            headers: {
                "Content-Type": "application/msgpack",
            },
            body: requestData,
        });

        if (!response.ok) {
            return;
        }

        const responseData = await response.arrayBuffer();
        if (responseData.byteLength == 0) {
            return;
        }

        const responseObject: any = decode(responseData);
        console.log("CounterValuePut: ", responseObject);

        return responseObject[3];
    }

    async function assignCounterValue() {
        const content = await readCounterValue();
        count = content.value;
        console.log("Count=", count);
    }

    let count: number = $state(0);

    function increment() {
        const increment = 1;
        count += increment;
        incrementRequest(increment);
    }

    assignCounterValue();
</script>

<button onclick={increment}>
    count is {count}
</button>
