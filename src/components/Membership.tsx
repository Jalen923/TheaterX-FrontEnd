import { useEffect, useState } from "react"

const Membership = () => {
    //types
    type MembershipPerk = {
        text: string
    }

    //states
    const [membershipPerks, setMembershipPerks] = useState<MembershipPerk[]>([])

    //effects
    useEffect(() => {
        (async() => {
            setMembershipPerks(await getMembershipPerks())
        })()
    }, [])

    //functions
    const getMembershipPerks = async() => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                    query {
                        membershipPerks {
                            text
                        }
                    }
                `
            })
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}`, options)
        const results = await response.json()
        return results.data.membershipPerks
    }

    return (
        <div className='membership-container'>
            <div className='membership-perks-container'>
                {
                    membershipPerks.slice(0, 4).map((membershipPerk, index) => 
                        <h1 key={index} className='membership-perk'>{membershipPerk.text}</h1>
                    )
                }
            </div>
            <div className='membership-title-container'>
              <h2 className='membership-subtitle'>Gain Access To These Amazing Benefits And More</h2>
              <h1 className='membership-title'>XPeriencePass</h1>
              <h2 className='membership-subtitle'>For as low as $15/mo</h2>
            </div>
            <div className='membership-perks-container'>
                {
                    membershipPerks.slice(4, 8).map((membershipPerk, index) => 
                        <h1 key={index} className='membership-perk'>{membershipPerk.text}</h1>
                    )
                }
            </div>
        </div>
    )
}

export default Membership