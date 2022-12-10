import { Image, Segment, Loader, Dimmer } from "semantic-ui-react";
import metamask from "../../img/metamask.gif";

export const LoaderAnimation = () => {
  return (
    <Segment fluid>
      <Dimmer active inverted>
        <Loader size="big">Processing Transaction</Loader>
      </Dimmer>
      <Image src={metamask} centered />
    </Segment>
  );
};
