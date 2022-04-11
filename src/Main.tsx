import React, {useEffect, useState} from "react";
import originalImage from "./images/ny_original.jpg";

import './App.css'


const Main = () => {

    const [state, setState] = useState<any>({
        pieces: [],
        shuffled: [],
        solved: []
    })

    function shufflePieces(pieces: any) {
        const shuffled = [...pieces];

        for (let i = shuffled.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let tmp = shuffled[i];
            shuffled[i] = shuffled[j];
            shuffled[j] = tmp;
        }

        return shuffled;
    }

    function handleDragStart(e: any, order: any) {
        const dt = e.dataTransfer;
        console.log(dt, 'dt')
        dt.setData('text/plain', order);
        dt.effectAllowed = 'move';
    }


    function renderPieceContainer(piece: any, index: any, boardName: any) {
        return (
            <li
                key={index}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, index, boardName)}>
                {
                    piece && <img
                        draggable
                        onDragStart={(e) => handleDragStart(e, piece.order)}
                        src={require(`./images/${piece.img}`)}/>
                }
            </li>
        );
    }

    function handleDrop(e: any, index: any, targetName: any) {
        // @ts-ignore
        let target = state[targetName];
        if (target[index]) return;

        const pieceOrder = e.dataTransfer.getData('text');
        // @ts-ignore
        const pieceData = state.pieces.find(p => p.order === +pieceOrder);
        // @ts-ignore
        const origin = state[pieceData.board];

        // @ts-ignore
        if (targetName === pieceData.board) target = origin;
        origin[origin.indexOf(pieceData)] = undefined;
        target[index] = pieceData;
        // @ts-ignore
        pieceData.board = targetName;

        // @ts-ignore
        setState(prevState => ({
            ...prevState,
            [pieceData.board]: origin, [targetName]: target
        }))
    }

    useEffect(() => {
        const pieces = [...Array(40)]
            .map((_, i) => (
                {
                    img: `ny_${('0' + (i + 1)).substr(-2)}.jpg`,
                    order: i,
                    board: 'shuffled'
                }
            ));

        // @ts-ignore
        setState(prevState => ({
            ...prevState,
            pieces,
            shuffled: shufflePieces(pieces),
            solved: [...Array(40)]
        }));
    }, [])


    return (
        <>
            {
                !!state.shuffled.length &&
                <div className="jigsaw">
                    <ul className="jigsaw__shuffled-board">
                        {state.shuffled.map((piece: any, i: any) => renderPieceContainer(piece, i, 'shuffled'))}
                    </ul>
                    <ol className="jigsaw__solved-board" style={{backgroundImage: `url(${originalImage})`}}>
                        {state.solved.map((piece: any, i: any) => renderPieceContainer(piece, i, 'solved'))}
                    </ol>
                </div>
            }
        </>

    )
}

export default Main


