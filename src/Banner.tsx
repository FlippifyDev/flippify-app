import './styles/banner.css'

// PascalCasing for function names
function Banner() {
    const title = <h1 className="banner-title">Flippify</h1>;

    let banner = <div className="banner">{title}</div>;

    return banner;
}

export default Banner;