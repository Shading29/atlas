import React from "react"
import ReactPaginate from "react-paginate"
import _ from "lodash"
import "./css/table.css"
import "./css/bootstrap.css"

export default class Table extends React.Component {



    constructor(props) {
        super(props);

        window.addEventListener("load", this.parseQuery)
    }

    // Парсер querry параметров поисковой строки
    parseQuery = () => {
        let obj = {};
        if(document.location.search) {
            let querry = (document.location.search.substr(1)).split('&');
            for(let i = 0; i < querry.length; i++) {
                let splitQuery = querry[i].split('=');
                obj[splitQuery[0]] = splitQuery[1]
            }
        }
        // Записываем полученные параметры в стейт
        this.props.handleQueryParams(obj)

        // Добавление данных Querry запросов в input фильтров
        if(this.props.queryParams){
            Object.keys(this.props.queryParams).forEach(item => {
                switch(item) {
                    case "title": this.props.handleValueTitle(this.props.queryParams[item]); break;
                    case "valueDateFrom": this.props.handleValueDateFrom(this.props.queryParams[item]); break;
                    case "valueDateTo": this.props.handleValueDateTo(this.props.queryParams[item]); break;
                    case "valueSortColumn":  this.props.handleValueSortColumn(this.props.queryParams[item]); break;
                    default: break
                }
            })

            // this.handleValueTitle(this.props.queryParams.title)
            // this.handleValueDateFrom(this.props.queryParams.valueDateFrom)
            // this.handleValueDateTo(this.props.queryParams.valueDateTo)
            // this.handleValueDateFrom(this.props.queryParams.valueSortColumn)
        }
    }

    // Input фильтров записываем в querry запрос строки
    setLocation = () => {
        const { valueDateFrom,
                valueDateTo,
                valueTitle,
                valueSortColumn
                } = this.props
                let url = []
                if(valueDateFrom) url.push(`valueDateFrom=${valueDateFrom}`);
                if(valueDateTo) url.push(`valueDateTo=${valueDateTo}`);
                if(valueTitle) url.push(`title=${valueTitle}`);
                if(valueSortColumn) url.push(`valueSortColumn=${valueSortColumn}`);
                const readyURL = url.join('&')
                // if(this.props.valueDateFrom) url += `valueDateFrom=${this.props.valueDateFrom}`;
                // if(this.props.valueDateTo) url += `valueDateTo=${this.props.valueDateTo}`;
                // if(this.props.valueTitle) url += `valueTitle=${this.props.valueTitle}`;
                // if(this.props.valueSortColumn) url += `valueSortColumn=${this.props.valueSortColumn}`;
                window.history.pushState(null,null, `?${readyURL}`)
        }

    // Обработчики записи в стейт
    selectPage = page => {
        this.props.handlePageSelect(page.selected)
    };

    handleValueDateFrom = value => {
        this.props.handleValueDateFrom(value)
        setTimeout(() => {
            this.setLocation()
        })
    }

    handleValueDateTo = value => {
        this.props.handleValueDateTo(value)
        setTimeout(() => {
            this.setLocation()
        })
    }

    handleValueTitle = value => {
        this.props.handleValueTitle(value)
        setTimeout(() => {
            this.setLocation()
        })
    }

    handleValueSortColumn = value => {
        this.props.handleValueSortColumn(value)
        setTimeout(() => {
            this.setLocation()
        })
    }


    // Фильтр по тайтлу
    filterByTitle = () => {
        const { valueTitle, data, } = this.props
        if(valueTitle !== '') {
            return data.filter(item => {
                return item.title.toLowerCase().includes(valueTitle.toLowerCase())
            })
        } else return this.props.data
    }

    // Фильтр по дате
    filterByDate = () => {
        const {valueDateFrom, valueDateTo} = this.props
        if(valueDateFrom !== '' && valueDateTo !== '') {
            return this.filterByTitle().filter(item => {
                return new Date(item.date) >= new Date(valueDateFrom) && new Date(item.date) <= new Date(valueDateTo)
            })
        } else return this.filterByTitle()

    };

/*    dateReverse = date => {
        let newDate = new Date(date.getMo)
    }*/

    render() {
        const { currentPage,
                linesPerPage,
                valueSortColumn,
                valueDateFrom,
                valueDateTo,
                valueTitle,
                } = this.props;

        // Сортировка по убыванию
        const sortedUsers = _.orderBy(this.filterByDate(), valueSortColumn, "desc")
        // debugger;
        //Разбиение на чанки
        let chunks = null
        sortedUsers.length !== 0
            ? chunks = _.chunk(sortedUsers, linesPerPage)[currentPage]
            : chunks = sortedUsers

        return (
            // Поля фильтров
            <div className={"container"}>
                <div className="filters">
                    <div className="filter">
                        <label>От</label>
                        <input
                            type={"date"}
                            value={valueDateFrom}
                            onChange={event => this.handleValueDateFrom(event.target.value)}
                        />
                    </div>
                    <div className="filter">
                        <label>До</label>
                        <input
                            type={"date"}
                            value={valueDateTo}
                            onChange={event => this.handleValueDateTo(event.target.value)}
                        />
                    </div>
                    <div className="filter">
                        <label>Заголовок</label>
                        <input
                            value={valueTitle}
                            onChange={event => this.handleValueTitle(event.target.value)}
                        />
                    </div>
                    <div className="filter">
                        <label>Sort type</label>
                        <select value={valueSortColumn}
                                onChange ={ event => this.handleValueSortColumn(event.target.value) }>
                            <option value={"date"}>По дате</option>
                            <option value={"comments"}>По комментариям</option>
                        </select>
                    </div>
                </div>

                {/* Таблица*/}
                <table className="table_dark">
                    <thead>
                    <tr>
                        <th>Заголовок</th>
                        <th>Дата</th>
                        <th>Количество комментариев</th>
                    </tr>
                    </thead>
                    {
                        chunks.map(item => {
                            return (
                                <tbody key={item.id}>
                                <tr>
                                    <td>{item.title}</td>
                                    <td>{item.date}</td>
                                    <td>{item.comments}</td>
                                </tr>
                                </tbody>
                            )
                        })
                    }
                </table>
                {/*Пагинация*/}
                {sortedUsers.length > 0
                ?   <ReactPaginate
                        previousLabel={'<='}
                        nextLabel={'=>'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(sortedUsers.length / linesPerPage)}
                        marginPagesDisplayed={5}
                        pageRangeDisplayed={15}
                        onPageChange={this.selectPage}
                        containerClassName={'pagination'}
                        pageLinkClassName={'page-link'}
                        pageClassName={'page-item'}
                        activeClassName={'active'}
                        previousClassName={'page-item'}
                        nextClassName={'page-item'}
                        nextLinkClassName={'page-link'}
                        previousLinkClassName={'page-link'}
                        disabledClassName={'disabled'}
                    />
                : null
                }
            </div>
        )
    }
}