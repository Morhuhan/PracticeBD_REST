package BD.practiceBD_REST.Objects;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class Allocation {

    private int id;

    private String pref;

    private String street;

    private String house;

    private String room;

    private String phone;

}