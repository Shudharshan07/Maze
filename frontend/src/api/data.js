import axios from 'axios';

async function GetMaze(width, height) {
    const url = `/maze?w=${width}&h=${height}`

    try  {
        const maze = await axios.get(url)
        
        return maze.data
    } catch (error) {
        console.error("Failed")
    }

    return
}

function Close() {
    window.addEventListener('pagehide', (event) => {
        navigator.sendBeacon('/close');
    });
}

export default GetMaze