package BD.practiceBD_REST.Security;

import lombok.*;


@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class MyUser {
    private Long id;
    private String name;
    private String password;
    private String roles;
}