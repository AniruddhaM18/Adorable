
//{ url } : { url : string } pass in as params in fn
export function Viewport({ url } : { url : string }){
     const TEST_URL = "http://anflow.aniruddha.xyz/";
    return(
       <div className="h-full w-full bg-slate-900 overflow-hidden">
      <iframe
        src={url}
        className="h-full w-full border-0"
        allow="clipboard-read; clipboard-write"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
    )
}

