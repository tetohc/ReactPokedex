import PropTypes from "prop-types";
import HeaderStyles from './Header.module.scss'
import Logo from '../../../assets/pokemon-icon.png'

export default function Header({ handleSearch = null }) {
    const reloadPage = () => { window.location.reload(); };
    return (
        <nav className={HeaderStyles.header}>
            <div className={HeaderStyles.div_header}>
                <div className={HeaderStyles.div_logo}>
                    <img src={Logo} alt='logo pokémon' onClick={reloadPage} />
                </div>
                <div className={HeaderStyles.div_search}>
                    <input type="search" id="search"
                        placeholder="Pokémon's name ..."
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

            </div>
        </nav>
    );
}
Header.propTypes = { handleSearch: PropTypes.func };