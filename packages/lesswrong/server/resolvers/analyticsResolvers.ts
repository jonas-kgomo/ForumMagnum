import { userOwns } from "../../lib/vulcan-users";
import { addGraphQLQuery, addGraphQLResolvers, addGraphQLSchema } from "../vulcan-lib";
import { getAnalyticsConnection } from "../analytics/postgresConnection";
import { forumTypeSetting } from "../../lib/instanceSettings";
import { PostMetricsResult } from "../../components/posts/usePostMetrics";

addGraphQLResolvers({
  Query: {
    async PostMetrics(root: void, { postId }: { postId: string }, context: ResolverContext): Promise<PostMetricsResult> {
      const { currentUser } = context;
      if (!currentUser) throw new Error(`No user`);
      const post = await context.loaders.Posts.load(postId);
      // check that the current user has permission to view post metrics
      // LW doesn't want to show this to authors, but we'll let admins see it
      if (forumTypeSetting.get() !== "EAForum" && !currentUser.isAdmin) {
        throw new Error("Permission denied");
      }
      // TODO; should maybe first test if user has something like Trust Level 1 (e.g. 1k karma)?
      if (!userOwns(currentUser, post) && !currentUser.isAdmin && !currentUser.groups.includes("sunshineRegiment")) {
        throw new Error("Permission denied");
      }

      const postgres = getAnalyticsConnection();
      if (!postgres) throw new Error("Unable to connect to analytics database - no database configured");

      // TODO; implement median function and change avg call to use it
      const queryStr = `
        SELECT
          count(*) as unique_client_views,
          avg(max_reading_time) as median_reading_time
        FROM (
          SELECT
            client_id,
            max(seconds) as max_reading_time
          FROM event_timer_event
          WHERE post_id = $1
            AND client_id IS NOT NULL
          GROUP BY client_id
        ) a
      `;
      const queryVars = [postId];

      const result = await postgres.query(queryStr, queryVars)
      if (!result.length) {
        throw new Error(`No data found for post ${post.title}`)
      }
      if (result.length > 1) {
        throw new Error(`Multiple rows found for post ${post.title}`)
      }
      const uniqueClientViews = result[0].unique_client_views;

      return {
        uniqueClientViews,
      };
    },
  },
});

addGraphQLSchema(`
  type PostMetricsResult {
    uniqueClientViews: Int
  }
`);

addGraphQLQuery("PostMetrics(postId: String!): PostMetricsResult!");
