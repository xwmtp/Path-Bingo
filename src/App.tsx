import React from 'react';
import BingoPage from "./components/BingoPage"

class App extends React.Component {




  render() {
    return (
      <div id="wrap">
        <main>
          <div className="container" id="pageContent">
            <BingoPage></BingoPage>
          </div>

        </main>
      </div>
    )
  }

}




export default App;
