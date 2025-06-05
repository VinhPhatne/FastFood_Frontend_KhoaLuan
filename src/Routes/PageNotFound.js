import React, { Component } from 'react';
import notFoundImage from '../assets/images/bg_404.png';

import './PageNotFound.css';

class PageNotFound extends Component {
    render() {
        return (
            <div className='page-not-found'>
                <img alt="not-found-background" src={notFoundImage} />
            </div>
        );
    }
}

export default PageNotFound;
