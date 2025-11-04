import { ScrollArea } from "@/components/ui/scroll-area";
import { type RaitingItem } from "@/types/types.raiting";
import { useEffect, useState } from "react";

const getRaitingItemClass = (place: number) => {
    if (place === 1) {
        return 'bg-gradient-to-r from-yellow-500/50 to-yellow-300/50';
    } else if (place === 2) {
        return 'bg-gradient-to-r from-gray-500/50 to-gray-300/50';
    } else if (place === 3) {
        return 'bg-gradient-to-r from-orange-800/50 to-orange-600/50';
    } else {
        return 'bg-gradient-to-r from-dark-900/50 to-dark-700/50';
    }
}

const Raiting = () => {
    const [raitingList, setRaitingList] = useState<RaitingItem[]>([]);

    useEffect(() => {
        fetch("http://localhost:5000/raiting")
            .then(response => response.json())
            .then(data => setRaitingList(data));
    }, []);

    const raitingListItems = raitingList.map((item: RaitingItem) => (
        <div className={`raiting-item flex flex-row my-2 justify-between items-center h-auto ${getRaitingItemClass(item.place)} dark:${getRaitingItemClass(item.place)} rounded-md p-4 border border-sidebar-border`}>
            <span className="text-sidebar-foreground font-medium">{item.name}</span>
            <span className="text-sidebar-foreground/70 text-sm font-bold">{item.score} очков</span>
        </div>
    ))
    
    return (
        <div className="flex flex-col items-center py-10 h-[calc(100vh-105px)]">
            <h2 className="text-2xl font-bold">Общий рейтинг</h2>
            <ScrollArea className="raiting-list-scroll flex flex-col w-full max-w-2xl mx-auto h-[calc(100vh-250px)] mt-2">
                {raitingListItems}
            </ScrollArea>
        </div>
    )
}

export default Raiting;