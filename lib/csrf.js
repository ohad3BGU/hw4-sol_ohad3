import { nextCsrf } from "next-csrf";

const { csrf, setup } = nextCsrf({
    // eslint-disable-next-line no-undef
    secret: "121212",
});

export { csrf, setup };