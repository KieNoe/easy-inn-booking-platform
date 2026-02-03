import React from 'react';

const HomePage: React.FC = () => {
  const user = { name: '小明' };

  return (
    <div className="home-page">
      <main>
        <section className="hero">
          <h1>欢迎回来, {user?.name || '游客'}</h1>
        </section>
        <section className="products">
          <h2>热门商品</h2>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
