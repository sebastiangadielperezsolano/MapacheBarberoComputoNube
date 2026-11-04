package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "servicio")
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idServicio")
    private Long idServicio;

    @NotNull
    @Column(name = "nombreServicio")
    private String nombreServicio;

    @NotNull
    @Column(name = "duracion")
    private Integer duracion;

    @NotNull
    @Column(name = "precio")
    @Digits(integer = 6, fraction = 2)
    private BigDecimal precio;

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "servicio", cascade = CascadeType.ALL)
    private List<Turno> turnos = new ArrayList<>();
}