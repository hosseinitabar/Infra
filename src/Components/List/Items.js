import React, { useState, useEffect, useContext } from 'react';
import { get } from '../../Base/Api';
import { ListContext } from './List';

const table = ({ data, headers, row }) => {
    console.log(headers);
    let headerElements = React.Children
        .toArray(headers.props.children)
        .map(header => React.cloneElement(header, {
            className: "text-gray-900 py-3 font-light text-xs"
        }));
    console.log(headerElements);

    return <table className="w-full text-center">
        <thead>
            <tr className='text-xs uppercase text-gray-900 font-light tracking-wider border-b'>
                {
                    headerElements
                }
            </tr>
        </thead>
        <tbody>
            {
                data.map((item, index) => <tr
                    key={item.id}
                    className={'py-3 ' + ((index === data.length - 1) ? '' : 'border-b')}
                >
                    {React.Children
                        .toArray(row(item).props.children)
                        .map(itemElemen => React.cloneElement(itemElemen, {
                            className: 'text-gray-900 py-3 text-sm font-light tracking-wide'
                        }))}
                </tr>)
            }
        </tbody>
    </table>
};

const Items = ({ entity, card, headers, row }) => {
    const [loading, setLoading] = useState();
    const [reloadedTimes, setReloadedTimes] = useState(0);
    const [data, setData] = useState([]);
    const { listParameters, reloadItems } = useContext(ListContext);

    const load = () => {
        setLoading(true);
        get(`${entity}/list?filters=${listParameters.filtersQueryString()}`).then((data) => {
            setData(data.data);
            setLoading(false);
            console.log(listParameters);
        }, (error) => {
            //error(error);
            console.error(error);
            setLoading(false);
        });
    };

    useEffect(() => {
        load();
    }, [reloadedTimes]);

    return <div id='items' className=''>
        {
            loading
                ?
                <div>loading...</div>
                :
                (
                    card
                        ?
                        data.map(item => <div className='item' key={item.id}>
                            {card(item)}
                        </div>)
                        :
                        table({ loading, data, headers, row })
                )
        }
    </div>
}

export default Items;