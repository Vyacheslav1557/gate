import {Configuration, DefaultApi} from "../../contracts/tester/v1/api";

const configuration = new Configuration({
    basePath: process.env.TESTER_URL,
});

const testerApi = new DefaultApi(configuration);

export {testerApi};

// export type Credentials = {
//     username: string,
//     password: string
// }
//
// const CookieName: any = "SESSIONID";
//
//
//
// export const DeleteTask = async (taskId: number) => {
//     const cookieStore = await cookies();
//
//     const session = cookieStore.get(CookieName);
//
//     if (session === undefined) {
//         throw new Error("Session id not found");
//     }
//
//     const options: AxiosRequestConfig = {
//         headers: {
//             'Authorization': "Bearer " + session.value
//         }
//     };
//
//     const response = await testerApi.deleteTask(taskId, options);
//     return response.data;
// }