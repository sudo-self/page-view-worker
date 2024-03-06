import { Redis } from "@upstash/redis/cloudflare";

export interface Env {
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
}

export default {
    async fetch(
        _request: Request,
        env: Env,
        _ctx: ExecutionContext,
    ): Promise<Response> {
        const redis = Redis.fromEnv(env);
        
       
        const currentCount = await redis.get("counter");
        let count = 1;
        
        if (currentCount !== null) {
           
            count = parseInt(currentCount) + 1;
            await redis.set("counter", count.toString());
        } else {
            
            await redis.set("counter", "1");
        }

    
        const htmlResponse = `
                             <!DOCTYPE html>
                             <html lang="en">
                             <head>
                                 <script async defer src="https://buttons.github.io/buttons.js"></script>
                                 <meta charset="UTF-8">
                                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                 <title>PageViews</title>
                                 <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                             </head>
                                     <body class="bg-gray-100 flex flex-col items-center justify-center h-screen">
                                         <div class="max-w-md w-full mx-auto bg-blue-200 rounded-lg p-6 mb-4">
                                             <div class="bg-white shadow-md rounded-lg p-6">
                                         <h1 class="text-3xl font-semibold text-center mb-4">Page Views</h1>
                                         <div class="text-center">
                                             <p class="text-5xl font-bold mb-4">${count}</p><br>
                                                         <a class="github-button" href="https://github.com/sudo-self/page-view-worker" data-color-scheme="no-preference: dark; light: light; dark: dark;" data-icon="octicon-star" data-size="large" aria-label="Star sudo-self/page-view-worker on GitHub">Star</a>
                                             <p class="text-lg text-green-600">
                                             </p>
                                         </div>
                                     </div>
                                     <p class="text-lg text-center text-gray-400 mt-4">count.jessejesse.workers.dev</p>
                                    
                                 </div>
                             </body>
                             </html>
        `;
        
       
        return new Response(htmlResponse, {
            headers: {
                "Content-Type": "text/html",
            },
        });
    },
};

