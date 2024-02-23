import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews (122)</div>
        </div>
        <div className="descriptionbox-description">
            <p>The dataset includes a variety of clothing products categorized for women, men, and kids.
               Each item is uniquely identified by an ID and includes details such as name, category, image, and price.
               Women's products feature stylish blouses with flutter sleeves and peplum hems, while men's items include trendy slim-fit bomber jackets.
               Additionally, there are vibrant hooded sweatshirts for kids with colorblocked designs, ensuring there's something for every fashion preference.
            </p>
            <p>The dataset encompasses a diverse range of apparel items, catering to different age groups and styles.
                Each product is meticulously described, highlighting its distinctive features and design elements.
                From chic and elegant blouses for women to urban bomber jackets for men, the collection offers fashionable choices.
                The inclusion of vibrant and trendy hooded sweatshirts for kids adds a playful and stylish dimension to the dataset.
            </p>
        </div>
    </div>
  )
}

export default DescriptionBox