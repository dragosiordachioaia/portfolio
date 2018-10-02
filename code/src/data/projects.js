export const projects = [
  {
    title: "The second project",
    roles: ["front-end", "back-end"],
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ut gravida arcu. Curabitur dapibus dolor nisi. Pellentesque ex dolor,
      tristique ut magna vel, rhoncus laoreet purus. Vestibulum maximus arcu sed enim ultricies hendrerit. Aenean sit amet accumsan nibh.
       Nam dictum vulputate sem at iaculis. Morbi fermentum nunc vel aliquet feugiat. Vestibulum ac sapien cursus mi varius hendrerit.
       Nulla fermentum, metus ac vestibulum blandit, ipsum nisl pharetra odio, eu vestibulum tellus ipsum sagittis dolor. Mauris sit
       amet euismod neque, sed facilisis leo. Cras vitae lorem in magna varius venenatis. Vestibulum in porta mauris.`,
  },
  {
    title: "Seating Plan Editor",
    roles: ["back-end"],
    demo: {
      screenshot: "charts.png",
      video:
        '<iframe src="https://www.youtube-nocookie.com/embed/Z3DVf80p3uM?rel=0&amp;controls=0&amp;showinfo=0&amp;mute=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen=""></iframe>',
    },
    specs: [
      {
        label: "front-end",
        values: ["jQuery", "LESS"],
      },
      {
        label: "back-end",
        values: ["Flask"],
      },
      {
        label: "storage",
        values: ["MySQL"],
      },
      {
        label: "deployment",
        values: ["CircleCI", "Kubernetes", "Google Cloud"],
      },
    ],
    description:
      "Sed a velit efficitur, cursus massa vitae, aliquam justo. Suspendisse lobortis pretium ligula ut laoreet. Cras eleifend aliquam enim, sed eleifend ipsum vulputate eu. Aliquam erat volutpat. Quisque venenatis vitae neque a vulputate. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin tincidunt vel purus in tincidunt. Maecenas sed erat elit. Proin imperdiet, diam nec congue cursus, lectus quam sollicitudin tortor, sit amet auctor justo ante nec sem. Vestibulum luctus dictum eros rutrum interdum. Integer laoreet accumsan felis et dignissim. Maecenas porttitor ipsum enim, in mattis nulla ultricies in. Duis sed venenatis purus. Aenean dapibus, ipsum non varius malesuada, lacus dui aliquam arcu, id aliquam massa ante eget odio. Suspendisse augue enim, tincidunt ac nunc sed, condimentum blandit eros.",
  },
];
