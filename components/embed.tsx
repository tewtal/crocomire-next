
interface EmbedData {
    resource: string;
    type: "video" | "clip" | "playlist";
    service: "youtube" | "twitch" | "unknown";
}

interface EmbedProps {
    link: string;
    width: number;
    height: number;
}

function parseEmbedLink(link: string): EmbedData {
    if(link.includes("twitch")) {
        if(link.includes("clips")) {
            const clipRe = new RegExp("https://clips\.twitch\.tv/(.*)$");
            const match = link.match(clipRe);
            if(match) {
                const resource = link.match(clipRe)[1];
                return { resource, type: "clip", service: "twitch" };
            }
        } else {
            let data: EmbedData = { resource: "", type: "video", service: "twitch" };            
            
            const vRe = new RegExp("https?://www\.twitch\.tv/(.*)?/./(.*)$");
            const matchVre = link.match(vRe);            
            if(matchVre) {
                data.resource = matchVre[2];
            }

            const videoRe = new RegExp("https?://www\.twitch\.tv/videos/(.*)$");
            const matchVideo = link.match(videoRe);
            if(matchVideo) {
                data.resource = matchVideo[1];
            }
            
            if(data.resource) {
                return data;
            }
        }
    } 
    else if(link.includes("youtube")) {
        const videoRe = new RegExp("https?://www\.youtube\.com/watch.v=([^&]*)?.*$");
        const matchVideo = link.match(videoRe);
        if(matchVideo) {
            return {
                resource: matchVideo[1],
                type: "video",
                service: "youtube"
            };
        }

        const playlistRe = new RegExp("https?://www\.youtube\.com/playlist.list=([^&]*)?.*$");
        const matchPlaylist = link.match(playlistRe);
        if(matchPlaylist) {
            return {
                resource: matchPlaylist[1],
                type: "playlist",
                service: "youtube"
            };
        }
    } else if(link.includes("youtu.be")) {
        const videoRe = new RegExp("https?://youtu.be/([^&]*)?.*$");
        const matchVideo = link.match(videoRe);
        if(matchVideo) {
            return {
                resource: matchVideo[1],
                type: "video",
                service: "youtube"
            };
        }
    }

    return {
        resource: link,
        type: "video",
        service: "unknown"
    };
}

function getEmbedComponent(data: EmbedData, width: number, height: number) {
    if(data.service === "twitch") {
        if(data.type === "video") {
            return (
                <iframe
                    style={{display: "block", marginLeft: "auto"}}
                    src={`https://player.twitch.tv/?video=v${data.resource}&parent=${location.hostname}&autoplay=false`}
                    width={width}
                    height={height}
                    frameBorder={0}
                    scrolling="no"
                    allowFullScreen={true}>
                </iframe>
            );
        } else if(data.type === "clip") {
            return (
                <iframe
                    style={{display: "block", marginLeft: "auto"}}
                    src={`https://clips.twitch.tv/embed?clip=${data.resource}&parent=${location.hostname}&autoplay=false`}
                    width={width}
                    height={height}
                    allowFullScreen={true}>                    
                </iframe>                 
            );
        }
    } else if(data.service === "youtube") {
        if(data.type === "video") {
            console.log(data.resource);    
            return (
                <iframe 
                    style={{display: "block", marginLeft: "auto"}}
                    src={`https://www.youtube-nocookie.com/embed/${data.resource}`}
                    width={width} 
                    height={height} 
                    title="YouTube video player" 
                    frameBorder={0} 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen={true}>                    
                </iframe>
            );
        } else if(data.type === "playlist") {
            return (
                <iframe 
                    style={{display: "block", marginLeft: "auto"}}
                    src={`https://www.youtube-nocookie.com/embed/videoseries?list=${data.resource}`}
                    width={width} 
                    height={height} 
                    title="YouTube video player" 
                    frameBorder={0} 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen={true}>                    
                </iframe>
            );
        }
    }
    
    data.resource = data.resource.replace("http:", "https:");
    return (
        <div>
            <iframe
                style={{display: "block", marginLeft: "auto"}}
                src={data.resource}
                width={width} 
                height={height} 
                frameBorder={0} 
                scrolling="no"
                allowFullScreen={true}>
            </iframe>
            <a href={data.resource}>{data.resource}</a>
        </div>
    );
}

export function Embed({link, width, height}: EmbedProps) {
    const data: EmbedData = parseEmbedLink(link);
    return data && getEmbedComponent(data, width, height);
}