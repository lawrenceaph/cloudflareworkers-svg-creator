/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

function generateHelpResponse() {
	return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta property="og:url" content="https://nftimage.pilipinas.dev/">
            <meta property="og:type" content="website">
            <meta property="og:title" content="Placeholder NFT Images">
            <meta property="og:description" content="A tiny api for sequential image generation">
            <meta property="og:image" content="https://imagedelivery.net/HML6qmlXDXx6EPV6zNm9VA/c7e675af-9ace-42ff-64a6-f2dedf2da400/public">
            <title>API Usage Guide</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 40px;
                    background-color: #f7f7f7;
                    color: #333;
                }
                .container {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #4CAF50;
                }
 code {
        display: block;
        padding: 10px;
        background-color: #f0f0f0;
        border-radius: 5px;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>API Usage Guide</h1>
                <p>To generate an SVG with a number:</p>
                <code >https://nftimage.pilipinas.dev/[NUMBER].svg</code>
                <br>
                or 
                <br><br>
                <code >https://nftimage.pilipinas.dev/[NUMBER].png</code>
                <p>Replace [NUMBER] with the desired number. This api can provide lightweight SVGs sequentially. Enjoy!</p>
            </div>
        </body>
        </html>
    `;
}
function mixColor(color1: any, color2: any, weight: any) {
	let w1 = weight;
	let w2 = 1 - w1;
	let rgb = [
		Math.round(color1[0] * w1 + color2[0] * w2),
		Math.round(color1[1] * w1 + color2[1] * w2),
		Math.round(color1[2] * w1 + color2[1] * w2),
	];
	return rgb;
}

function randomPastelColor(dark = false) {
	const randomRGB = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
	const white = [255, 255, 255];
	const darkColor = [85, 85, 85]; // This can be adjusted for desired darkness

	if (dark) {
		return `rgb(${mixColor(randomRGB, darkColor, 0.5).join(',')})`;
	} else {
		return `rgb(${mixColor(randomRGB, white, 0.5).join(',')})`;
	}
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const numberMatch = url.pathname.match(/\/(\d+)\.png/) || url.pathname.match(/\/(\d+)\.svg/);
		if (!numberMatch) {
			return new Response(generateHelpResponse(), {
				status: 200,
				headers: {
					'Content-Type': 'text/html',
				},
			});
		}

		const number = numberMatch[1];
		const textColor = randomPastelColor(true);
		const backgroundColor = randomPastelColor();
		const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${backgroundColor}" rx="20" ry="20"></rect>
      <text x="100" y="100" font-family="Arial" font-size="60" text-anchor="middle" fill="${textColor}">${number}</text>
    </svg>
  `;

		return new Response(svg, {
			status: 200,
			headers: {
				'content-type': 'image/svg+xml',
			},
		});
	},
};
