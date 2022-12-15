export function Profile({
    first_name,
    last_name,
    img_url,
    nick_name,
    bio,
    avatar,
}) {
    return (
        <div>
            <h2>Thats you</h2>
            <img
                src={img_url ? img_url : avatar}
                alt={`${first_name} ${last_name}`}
            />
            <h3>{nick_name}</h3>
            <p>{bio}</p>
        </div>
    );
}
