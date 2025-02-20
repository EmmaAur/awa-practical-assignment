/*
Sources:
Fix error "Property 'x' does not exist on type 'never'":
https://stackoverflow.com/questions/73699858/why-my-property-does-not-exist-on-type-never/73700310
*/
import { useEffect, useState } from "react"
// import '../styles/About.css'

const About = () => {
    const [data, setData] = useState([])
    const [amount, setAmount] = useState(12)

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(json => setData(json))
        //.then(json => setData(JSON.stringify(json)))
    }, [])
    
    return (
        <>
        <div className="grid-container">
            {
            data.slice(0, amount).map((item) => (
                <div className="grid-item" key={item['id']}>
                    <h3>{item['title']}</h3>
                    <p>{item['body']}</p>
                </div>
            ))
            }
        </div>
        <button onClick={() => {setAmount(amount + 12)}}>Show more</button>
        </>
    );
};
export default About
