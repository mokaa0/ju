1
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Discord Giveaway Dashboard</title>
<link href="style.css" rel="stylesheet">
</head>
<body class="bg-gray-900 text-white">
<div id="root"></div>
<script type="module" src="main.jsx"></script>
</body>
</html>

3
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

function App(){
  const [guilds,setGuilds]=useState([]);
  const [selectedGuild,setSelectedGuild]=useState(null);
  const [settings,setSettings]=useState({prefix:"#",accessRole:null,autoReplies:{enabled:false,list:[]}});

  useEffect(()=>{axios.get("/api/guilds").then(res=>setGuilds(res.data)).catch(()=>{});},[]);
  useEffect(()=>{if(selectedGuild){axios.get(`/api/guild/${selectedGuild}/settings`).then(res=>setSettings(res.data))}},[selectedGuild]);

  const login=()=>{window.location.href="/api/login";}
  const saveSettings=()=>{axios.post(`/api/guild/${selectedGuild}/settings`,settings).then(()=>alert("Saved!"));}
  const addAutoReply=()=>{setSettings(prev=>({...prev,autoReplies:{...prev.autoReplies,list:[...prev.autoReplies.list,{short:"",reply:""}]}}));}

  return(
    <div className="flex h-screen">
      <div className="w-64 bg-gray-800 p-4">
        <h2 className="font-bold mb-4">Servers</h2>
        <button onClick={login} className="w-full bg-red-500 py-2 mb-4 rounded">Login with Discord</button>
        {guilds.map(g=>(
          <div key={g.id} onClick={()=>setSelectedGuild(g.id)} className="p-2 hover:bg-gray-700 rounded cursor-pointer">{g.name}</div>
        ))}
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedGuild?(
          <div className="space-y-6">
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="font-bold mb-2">Prefix</h3>
              <input value={settings.prefix} onChange={e=>setSettings({...settings,prefix:e.target.value})} className="bg-gray-700 px-2 py-1 rounded mr-2"/>
              <button onClick={saveSettings} className="bg-black px-4 py-1 rounded">Save</button>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="font-bold mb-2">Access Role</h3>
              <select value={settings.accessRole||""} onChange={e=>setSettings({...settings,accessRole:e.target.value})} className="bg-gray-700 px-2 py-1 rounded">
                <option value="">None</option>
                <option value="123">Role 1</option>
                <option value="456">Role 2</option>
              </select>
            </div>
            <div className="bg-gray-800 p-4 rounded">
              <h3 className="font-bold mb-2 flex items-center">Auto Replies
                <input type="checkbox" checked={settings.autoReplies.enabled} onChange={e=>setSettings({...settings,autoReplies:{...settings.autoReplies,enabled:e.target.checked}})} className="ml-2"/>
              </h3>
              {settings.autoReplies.list.map((ar,i)=>(
                <div key={i} className="flex gap-2 mb-2">
                  <input placeholder="Short" value={ar.short} onChange={e=>{const newList=[...settings.autoReplies.list]; newList[i].short=e.target.value; setSettings({...settings,autoReplies:{...settings.autoReplies,list:newList}})}} className="bg-gray-700 px-2 py-1 rounded flex-1"/>
                  <input placeholder="Reply" value={ar.reply} onChange={e=>{const newList=[...settings.autoReplies.list]; newList[i].reply=e.target.value; setSettings({...settings,autoReplies:{...settings.autoReplies,list:newList}})}} className="bg-gray-700 px-2 py-1 rounded flex-1"/>
                </div>
              ))}
              <button onClick={addAutoReply} className="bg-black px-4 py-1 rounded">+</button>
            </div>
          </div>
        ):<div className="text-gray-400">Select a server from the left panel.</div>}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);