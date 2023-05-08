import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import VideoCard from '../../components/video-card/VideoCard.jsx';
import Button from '../../components/button/Button.jsx';
import Spinner from '../../components/spinner/Spinner.jsx';
import {
  ourFetch,
  convertTimeToCardFormat,
  convertViewsToCardFormat,
  getTimeZoneOffset,
} from '../../shared/helperFunctions';
import DataTable from 'react-data-table-component';
import Select from 'react-select';

const conf = require('../../shared/config')();

const allCategories = [
  "Film & Animation", 
  "Music", 
  "Autos & Vehicles", 
  "Travel & Events", 
  "Pets & Animals", 
  "Sports", 
  "People & Blogs",
  "Gaming",
  "Comedy",
  "Entertainment",
  "How-To & Style",
  "News & Politics",
  "Nonprofits & Activism",
  "Education",
  "Science & Technology"
];

class WishList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoCardsComponents: [],
      rows: [],
      search: "",
      selectedCategories: [""],
    };

    // Data table related variables
    this.wishListItems = [];
    this.youTubeIds = [];
    this.youDescribeIds = [];
    this.votes = [];
    this.updatedAt = [];
    this.categories = [];
    this.totalRows = 0;
    this.perPage = 10;

    // Top 5 related variables
    this.topWishListItems = [];
    this.topYoutubeIds = [];
    this.topYouDescribeIds = [];
    this.topVotes = [];


    // Data table
    this.columns = [
      {
        name: "Thumbnail",
        grow: 0,
        cell: (row) => (
          <img
            height="40px"
            width="80px"
            alt={row.title}
            src={row.thumbnail.url}
          />
        ),
      },
      {
        name: "Title",
        selector: (row) => row.title,
        grow: 3,
        sortable: true,
        wrap: true,
      },
      {
        name: "Author",
        selector: (row) => row.author,
        grow: 1,
        sortable: true,
        wrap: true,
      },
      {
        name: "Category",
        selector: (row) => row.category,
        grow: 1,
        sortable: true,
        wrap: true,
        hide: "sm",
      },
      {
        name: "Last Voted",
        selector: (row) => row.lastVoted,
        grow: 1,
        sortable: true,
        wrap: true,
        hide: "md",
      },
      {
        name: "Votes",
        selector: (row) => row.votes,
        grow: 0,
        sortable: true,
      },
      {
        cell: (row) => (
          <Button
            ariaLabel={this.props.translate(
              "Create an audio description for this video"
            )}
            text={this.props.translate("Describe")}
            color="w3-indigo w3-right"
            onClick={() => this.describeThisVideo(row.youTubeId)}
          />
        ),
        button: true,
        width: "90px",
      },
    ];

    this.currentPageNumber = 1;
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePerRowsChange = this.handlePerRowsChange.bind(this);
    this.loadWishListVideos = this.loadTableVideos.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }

  componentDidMount() {
    document.title = this.props.translate("YouDescribe - Wish List");
    this.loadTopVideos();
    this.loadTableVideos();
  }

  describeThisVideo(youTubeId) {
    if (this.props.getAppState().isSignedIn) {
      alert('We are upgrading our systems! This feature is currently unavailable')
      // browserHistory.push("/authoring-tool/" + youTubeId);
    } else {
      alert(
        this.props.translate(
          "You have to be logged in in order to describe this video"
        )
      );
    }
  }

  /*
    Loads data for the table using the /wishlist/search endpoint
    The endpoint requires the following query parameters
      - page: The page number to be fetched
      - perPage: Number of items to be displayed on each page
      - search: The search string to be passed (joined with the %20 separator)
      - category: The list of categories that the search should be filtered by. Each category is comma separated and joined with the %20 separator.
  */
  loadTableVideos() {
    const searchString = this.state.search.split(" ").join("%20");
    const categoryString = this.state.selectedCategories
      .map((category) => category.replace("&", "%26").split(" ").join("%20"))
      .join(",");
    const url = `${conf.apiUrl}/wishlist/search?page=${
      this.currentPageNumber
    }&per_page=${this.perPage}${
      this.state.search !== "" ? `&search=${searchString}` : ""
    }${categoryString !== "" ? `&category=${categoryString}` : ""}`;
    ourFetch(url)
      .then((response) => {
        const wishListItems = response.result.items;
        this.totalRows = response.result.count;
        this.youTubeIds = [];
        this.youDescribeIds = [];
        this.votes = [];
        this.updatedAt = [];
        this.categories = [];
        for (let i = 0; i < wishListItems.length; i += 1) {
          this.youTubeIds.push(wishListItems[i].youtube_id);
          this.youDescribeIds.push(wishListItems[i]._id);
          this.votes.push(wishListItems[i].votes);
          this.updatedAt.push(wishListItems[i].updated_at);
          this.categories.push(wishListItems[i].category);
        }
      })
      .then(() => {
        const url = `${
          conf.apiUrl
        }/videos/getyoutubedatafromcache?youtubeids=${this.youTubeIds.join(
          ","
        )}&key=wishlist`;
        ourFetch(url).then((response) => {
          this.parseTableData(JSON.parse(response.result));
        });
      })
      .catch((err) => {
        this.totalRows = 0;
        this.setState({ ...this.state, rows: [] });
      });
  }

  parseTableData(youTubeResponse) {
    let rows = [];
    for (let i = 0; i < youTubeResponse.items.length; i += 1) {
      const item = youTubeResponse.items[i];
      if (!item.statistics || !item.snippet) {
        continue;
      }
      const youTubeId = item.id;
      const thumbnailMedium = item.snippet.thumbnails.medium;
      const title = item.snippet.title;
      const author = item.snippet.channelTitle;
      const timezoneOffset = getTimeZoneOffset(new Date(), 'America/Los_Angeles');
      const now = Date.now() + (timezoneOffset * 60000);
      const updatedAt = String(this.updatedAt[i]);
      const lastUpdated = new Date(
        updatedAt.slice(0, 4),
        Number(updatedAt.slice(4, 6)) - 1,
        updatedAt.slice(6, 8),
        updatedAt.slice(8, 10),
        updatedAt.slice(10, 12),
        updatedAt.slice(12)
      ).getTime();
      const diffToLastUpdate = convertTimeToCardFormat(
        Number(now - lastUpdated)
      );
      const votes = this.votes[i];
      const category = this.categories[i];

      rows.push({
        title: title,
        votes: votes,
        author: author,
        youTubeId: youTubeId,
        thumbnail: thumbnailMedium,
        lastVoted: diffToLastUpdate,
        category: category,
      });
    }
    this.setState({ ...this.state, rows: rows });
  }

  /*
    Loads the top 5 most requested videos by calling the /wishlist/top endpoint. No query parameters are required for this call.
  */
  loadTopVideos() {
    const url = `${conf.apiUrl}/wishlist/top/`;
    ourFetch(url)
      .then((response) => {
        const wishListItems = response.result;
        this.topYouTubeIds = [];
        this.topYouDescribeIds = [];
        this.topVotes = [];
        for (let i = 0; i < wishListItems.length; i += 1) {
          this.topYouTubeIds.push(wishListItems[i].youtube_id);
          this.topYouDescribeIds.push(wishListItems[i]._id);
          this.topVotes.push(wishListItems[i].votes);
        }
      })
      .then(() => {
        const url = `${
          conf.apiUrl
        }/videos/getyoutubedatafromcache?youtubeids=${this.topYouTubeIds.join(
          ","
        )}&key=wishlist`;
        ourFetch(url).then((response) => {
          this.parseFetchedData(JSON.parse(response.result));
        });
      });
  }

  parseFetchedData(youTubeResponse) {
    const videoCardsComponents = this.state.videoCardsComponents.slice();
    for (let i = 0; i < youTubeResponse.items.length; i += 1) {
      const item = youTubeResponse.items[i];
      if (!item.statistics || !item.snippet) {
        continue;
      }
      const _id = this.topYouDescribeIds[i];
      const youTubeId = item.id;
      const thumbnailMedium = item.snippet.thumbnails.medium;
      const title = item.snippet.title;
      const description = item.snippet.description;
      const author = item.snippet.channelTitle;
      const views = convertViewsToCardFormat(Number(item.statistics.viewCount));
      const publishedAt = new Date(item.snippet.publishedAt);
      const now = Date.now();
      const votes = this.topVotes[i];
      const time = convertTimeToCardFormat(Number(now - publishedAt));

      videoCardsComponents.push(
        <VideoCard
          key={_id}
          translate={this.props.translate}
          youTubeId={youTubeId}
          thumbnailMediumUrl={thumbnailMedium.url}
          title={title}
          description={description}
          author={author}
          views={views}
          time={time}
          votes={votes}
          buttons="upvote-describe"
          getAppState={this.props.getAppState}
        />
      );
    }
    this.setState({ ...this.state, videoCardsComponents });
    this.closeSpinner();
  }


  // Handle search field change
  handleChange(e) {
    this.setState({ ...this.state, search: e.target.value });
  }

  // Handle category select change
  handleCategoryChange(selectedCategories) {
    let values = Array.from(selectedCategories, (option) => option.value);
    this.setState({ ...this.state, selectedCategories: values });
  }

  // Handle page change for data table
  handlePageChange(page) {
    this.currentPageNumber = page;
    this.loadTableVideos();
  }

  // Handle rows per page change for data table
  handlePerRowsChange(newPerPage) {
    this.perPage = newPerPage;
    this.loadTableVideos();
  }

  closeSpinner() {
    const spinner = document.getElementsByClassName("spinner")[0];
    spinner.style.display = "none";
  }

  render() {
    return (
      <main id="wish-list" title="Wish list page">
        <div className="w3-container w3-indigo">
          <h2 id="wish-list-heading" tabIndex="-1">
            {this.props.translate("WISH LIST")}
          </h2>
        </div>
        <Spinner translate={this.props.translate} />
        <div className="w3-row-padding container w3-margin-top">
          Most Requested Videos
        </div>
        <div className="w3-row-padding container">
          {this.state.videoCardsComponents}
        </div>
        <div className="w3-row-padding container search-container">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            value={this.state.search}
            onChange={this.handleChange}
          />
          <div className="category-select">
            <span className="category-label">Category</span>
            <Select
              options={allCategories.map((category) => {
                let option = { value: category, label: category };
                return option;
              })}
              isMulti
              onChange={this.handleCategoryChange}
            />
          </div>
          <button
            className="w3-btn w3-indigo search-button"
            onClick={() => this.loadTableVideos()}
          >
            Search
          </button>
        </div>
        <div className="table-container">
          <DataTable
            title="All Wishlist Videos"
            columns={this.columns}
            data={this.state.rows}
            responsive
            pagination
            paginationServer
            paginationTotalRows={this.totalRows}
            onChangePage={(page) => this.handlePageChange(page)}
            onChangeRowsPerPage={(newPerPage) =>
              this.handlePerRowsChange(newPerPage)
            }
            customStyles={{
              cells: {
                style: {
                  overflow: "visible !important",
                  whiteSpace: "break-spaces !important",
                  textOverflow: "unset !important",
                  overflowWrap: "break-word !important",
                },
              },
            }}
          />
        </div>
      </main>
    );
  }
}

export default WishList;
