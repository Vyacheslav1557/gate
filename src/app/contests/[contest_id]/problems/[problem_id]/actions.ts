"use server";

import {getAuthToken, withBearerAuth} from "@/lib/auth";
import {testerApi} from "@/lib/api";
import {LanguageName} from "@/lib/lib";

export const CreateSolution = async (
    contestId: number,
    problemId: number,
    solution: FormData,
    language: string
): Promise<number | null> => {
    const token = await getAuthToken();
    if (!token) {
        return null;
    }

    if (!contestId || !problemId) {
        return null;
    }

    const fileOrString = solution.get("solution");

    if (!fileOrString) {
        return null;
    }

    const options = withBearerAuth(token);

    let solutionFile: File;

    // Check if fileOrString is a File or string
    if (fileOrString instanceof File) {
        // Directly use the provided file
        solutionFile = fileOrString;
    } else {
        // Convert string to File
        solutionFile = new File(
            [fileOrString.toString()],
            "solution.txt",
            {type: "text/plain"}
        );
    }

    let langName: number = 0;
    switch (language) {
        case ("golang"): {
            langName = LanguageName.Golang;
            break
        }
        case ("cpp"): {
            langName = LanguageName.Cpp;
            break
        }
        case ("python"): {
            langName = LanguageName.Python;
            break
        }
        default: {
            return null;
        }
    }

    try {
        const response = await testerApi.createSolution(
            problemId,
            contestId,
            langName,
            solutionFile,
            options
        );

        return response.data.id;
    } catch (error) {
        console.error("Failed to create solution:", error);
        return null;
    }
};