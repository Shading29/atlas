import React from 'react';
import Table from "./components/Table/Table";

const url = "https://gist.githubusercontent.com/SlivTime/7e259e2b8c3206163295cbf1ab01a5f7/raw/1146ffc9aeb46e6c0b62c21bf4209ba245600398/events.json";

class App extends React.Component {

  state = {
    data: '',
    isLoading: true,
    currentPage: '0',
    linesPerPage: '25',

    valueDateFrom: '',
    valueDateTo: '',
    valueTitle: '',
    valueSortBy: '',
    valueSortColumn: '',
    queryParams: {}
  };

  async componentDidMount() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
          this.setState({
            data,
            isLoading: false
        })
    })
  };

  // Обработчики обновления данных в стейты
  handleQueryParams = queryParams => {
    this.setState({
      queryParams
    })
  }

  handlePageSelect = currentPage => {
    this.setState({
      currentPage
    })
  }

  handleValueDateFrom = valueDateFrom => {
     this.setState({
      valueDateFrom
    })
  }

  handleValueDateTo = valueDateTo => {
    this.setState({
      valueDateTo
    })
  }

  handleValueTitle = valueTitle => {
    console.log(valueTitle)
    this.setState({
      valueTitle
    })
  }

  handleValueSortColumn = valueSortColumn => {
    this.setState({
      valueSortColumn
    })
  }

  render() {
    return (
        <div>
          {this.state.isLoading
              ? null
              : <Table data={this.state.data}
                       currentPage={this.state.currentPage}
                       linesPerPage={this.state.linesPerPage}

                       handlePageSelect={this.handlePageSelect}
                       handleValueDateFrom={this.handleValueDateFrom}
                       handleValueDateTo={this.handleValueDateTo}
                       handleValueTitle={this.handleValueTitle}
                       handleValueSortColumn={this.handleValueSortColumn}
                       handleQueryParams={this.handleQueryParams}

                       valueDateFrom={this.state.valueDateFrom}
                       valueDateTo={this.state.valueDateTo}
                       valueTitle={this.state.valueTitle}
                       valueSortColumn={this.state.valueSortColumn}
                       queryParams={this.state.queryParams}
              />
          }
        </div>
    )
  }
}

export default App;
