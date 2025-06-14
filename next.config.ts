import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    experimental: {
        authInterrupts: true,
        serverActions: {
            bodySizeLimit: '512mb',
        },
    },
    // typescript: {
    //     // !! WARN !!
    //     // Dangerously allow production builds to successfully complete even if
    //     // your project has type errors.
    //     // !! WARN !!
    //     ignoreBuildErrors: true,
    // },
};

export default nextConfig;
